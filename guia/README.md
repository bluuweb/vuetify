# Calendario

Vamos a construir un calendario utilizando Vuetify & Firebase, [https://medium.com/@jsfanatik/how-to-build-an-event-calendar-with-vue-js-and-firebase-967d734f0ed0](https://medium.com/@jsfanatik/how-to-build-an-event-calendar-with-vue-js-and-firebase-967d734f0ed0)

## Instalación Vue CLI

Hacer este paso solo si no tienes instalado Vue CLI

```
npm install @vue/cli -g
```

## Nuevo proyecto de Vue

```
vue create app-calendario
cd app-calendario
```

## Agregar Vuetify

```
vue add vuetify
```

## Instalar Firebase

```
npm i firebase
```

## Tamaño auto text-area

```
npm i vue-textarea-autosize
```

## Main.js

```js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import VueTextareaAutosize from "vue-textarea-autosize";
Vue.use(VueTextareaAutosize);

import firebase from "firebase/app";
import "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx",
  databaseURL: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
```

## App.vue

```html
<template>
  <v-app>
    <v-content>
      <Calendario />
    </v-content>
  </v-app>
</template>

<script>
  import Calendario from "./components/Calendario";

  export default {
    name: "App",
    components: {
      Calendario
    },
    data: () => ({
      //
    })
  };
</script>
```

## Calendario.vue

Comenzaremos a trabajar en el componente del calendario [https://vuetifyjs.com/es-MX/components/calendars#events](https://vuetifyjs.com/es-MX/components/calendars#events)

```html
<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">

          <!-- Botón Agregar Evento -->

          <v-btn outlined class="mr-4" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn
                outlined
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :event-margin-bottom="3"
          :now="today"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>

        <!-- Agregar Modal Agregar Evento -->

        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          full-width
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <!-- Agregar Funcionalidades Editar y Eliminar -->
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    data: () => ({
      today: new Date().toISOString().substr(0, 10),
      focus: new Date().toISOString().substr(0, 10),
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      // Adicionales...
      name: null,
      details: null,
      color: '#1976D2',
      dialog: false,
      currentlyEditing: null
    }),
    computed: {
      title () {
        const { start, end } = this
        if (!start || !end) {
          return ''
        }

        const startMonth = this.monthFormatter(start)
        const endMonth = this.monthFormatter(end)
        const suffixMonth = startMonth === endMonth ? '' : endMonth

        const startYear = start.year
        const endYear = end.year
        const suffixYear = startYear === endYear ? '' : endYear

        const startDay = start.day + this.nth(start.day)
        const endDay = end.day + this.nth(end.day)

        switch (this.type) {
          case 'month':
            return `${startMonth} ${startYear}`
          case 'week':
          case '4day':
            return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
          case 'day':
            return `${startMonth} ${startDay} ${startYear}`
        }
        return ''
      },
      monthFormatter () {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        })
      },
    },
    mounted () {
      this.$refs.calendar.checkChange()
    },
    methods: {
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = this.today
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
        this.start = start
        this.end = end
      },
      nth (d) {
        return d > 3 && d < 21
          ? 'th'
          : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
      },
    },
  }
</script>
```

## Leer Eventos Firebase
```js
mounted() {
  this.getEvents();
},
async getEvents() {
  try {
    const snapshot = await db.collection("calEvent").get();
    const events = [];
    snapshot.forEach(doc => {
      console.log(doc.data());
      let appData = doc.data();
      appData.id = doc.id;
      events.push(appData);
    });
    this.events = events;
  } catch (error) {
    console.log(error);
  }
},
```

## Modal agregar evento
```html
<!-- Boton -->
<v-btn color="primary" dark class="mr-4" @click="dialog = true">New Event</v-btn>

<!-- Modal -->
<v-dialog v-model="dialog" max-width="500">
  <v-card>
    <v-container>
      <v-form @submit.prevent="addEvent">
        <v-text-field v-model="name" type="text" label="event name (requiered)"></v-text-field>
        <v-text-field v-model="details" type="text" label="details"></v-text-field>
        <v-text-field v-model="start" type="date" label="start"></v-text-field>
        <v-text-field v-model="end" type="date" label="end"></v-text-field>
        <v-text-field v-model="color" type="color" label="color"></v-text-field>
        <v-btn type="submit" color="primay" class="mr-4" @click.stop="dialog = false">Create Event</v-btn>
      </v-form>
    </v-container>
  </v-card>
</v-dialog>
```

```js
async addEvent(){
  try {
    if(this.name && this.start && this.end){
      await db.collection('calEvent').add({
        name: this.name,
        details: this.details,
        start: this.start,
        end: this.end,
        color: this.color
      })
      this.getEvents();
      this.name = '';
      this.details = '';
      this.start = '';
      this.end = '';
      this.color = '#1976D2';
    }else{
      alert('Campos obligatorios')
    }
  } catch (error) {
    console.log(error);
  }
},
```

## v-calendar en Español
```html
<v-calendar
  :weekdays="[1, 2, 3, 4, 5, 6, 0]"
  locale="es"
  :short-weekdays="false"
></v-calendar>
```

## Editar y Eliminar
```html{3-5,10-18,21-23}
<v-card color="grey lighten-4" min-width="350px" flat>
  <v-toolbar :color="selectedEvent.color" dark>
    <v-btn icon @click="deleteEvent(selectedEvent.id)">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
    <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>
  <v-card-text>
    <v-form v-if="currentlyEditing !== selectedEvent.id">
      {{selectedEvent.name}} - {{selectedEvent.details}}
    </v-form>
    <v-form v-else> 
      <v-text-field v-model="selectedEvent.name" type="text" label="name"></v-text-field>
      <textarea-autosize 
        v-model="selectedEvent.details" type="text" style="width: 100%" :min-height="100" placeholder="add note">
      </textarea-autosize>
    </v-form>
  </v-card-text>
  <v-card-actions>
    <v-btn text color="secondary" @click="selectedOpen = false">Close</v-btn>
    <v-btn text v-if="currentlyEditing !== selectedEvent.id" @click.prevent="editEvent(selectedEvent)">Edit</v-btn>
    <v-btn text v-else @click.prevent="updateEvent(selectedEvent)">Save</v-btn>
  </v-card-actions>
</v-card>
```
```js
editEvent(ev){
  this.currentlyEditing = ev.id;
},
async updateEvent(ev){
  try {
    await db.collection('calEvent').doc(this.currentlyEditing).update({
      details: ev.details,
      name: ev.name
    })
    this.selectedOpen = false;
    this.currentlyEditing = null;
  } catch (error) {
    console.log(error);
  }
},
async deleteEvent(ev){
  try {
    await db.collection('calEvent').doc(ev).delete();
    this.selectedOpen = false;
    this.getEvents();
  } catch (error) {
    console.log(error);
  }
},
```

