# Páginación Firestore
Veamos como crear una paginación con Firestore utilizando el CDN de Vuetify

## CDN Vuetify
Accede al siguiente enlace: [https://vuetifyjs.com/es-MX/getting-started/quick-start#uso-de-una-cdn](https://vuetifyjs.com/es-MX/getting-started/quick-start#uso-de-una-cdn)

```html
<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css" rel="stylesheet">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
</head>
<body>
  <div id="app">
    <v-app>
      <v-content>
        <v-container>Hello world</v-container>
      </v-content>
    </v-app>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js"></script>
  <script>
    new Vue({
      el: '#app',
      vuetify: new Vuetify(),
    })
  </script>
</body>
</html>
```

## CDN Firebase
Accede al siguiente enlace: [https://firebase.google.com/docs/web/setup?authuser=0#delay-sdks-cdn](https://firebase.google.com/docs/web/setup?authuser=0#delay-sdks-cdn)

```html
<!-- Firebase App (the core Firebase SDK) is always required and must be listed first -->
<script defer src="https://www.gstatic.com/firebasejs/7.5.2/firebase-app.js"></script>
<script defer src="https://www.gstatic.com/firebasejs/7.5.2/firebase-firestore.js"></script>

<script>
var firebaseConfig = {
  apiKey: "api-key",
  authDomain: "project-id.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "sender-id",
  appId: "app-id",
  measurementId: "G-measurement-id",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
</script>
```

## jsonplaceholder
Agregaremos los siguientes datos: [https://jsonplaceholder.typicode.com/](https://jsonplaceholder.typicode.com/)

```js
methods: {
  agregarDatos(){
    fetch('posts.json').then(res => res.json()).then(res => {
      console.log(res);
      res.forEach(item => {
        // console.log(item);
        db.collection('blog').add(item)
      })
    })
  }
}
```
boton
```html
<v-btn @click="agregarDatos">Agregar Datos</v-btn>
```

## Limit Firestore
[https://firebase.google.com/docs/firestore/query-data/order-limit-data?authuser=0](https://firebase.google.com/docs/firestore/query-data/order-limit-data?authuser=0)

```js
data: {
  entradas: [],
  last: null,
  desactivar: false
},
created() {
  this.leerDatos();
},
methods: {
  leerDatos() {
    db.collection("blog")
      .limit(2)
      .orderBy("id")
      .get()
      .then(querySnapshot => {
        // Nos guarda el último artículo
        this.last = querySnapshot.docs[querySnapshot.docs.length - 1];
        
        querySnapshot.forEach(doc => {
          this.entradas.push(doc.data());
        });

      });
  },
}
```

```html
<v-container>
  <v-row>
    <v-col
      cols="12"
      md="4"
      v-for="(item, index) in entradas"
      :key="index"
    >
      <v-card>
        <v-card-title>{{item.title}}</v-card-title>
        <v-card-subtitle>
          {{item.id}}
        </v-card-subtitle>
        <v-card-text>{{item.body}}</v-card-text>
      </v-card>
    </v-col>
  </v-row>
</v-container>
```

## Paginación
[https://firebase.google.com/docs/firestore/query-data/query-cursors?authuser=0#paginate_a_query](https://firebase.google.com/docs/firestore/query-data/query-cursors?authuser=0#paginate_a_query)

```js
siguiente() {
  db.collection("blog")
    .limit(2)
    .orderBy("id")
    .startAfter(this.last)
    .get()
    .then(querySnapshot => {
      this.last = querySnapshot.docs[querySnapshot.docs.length - 1];
      querySnapshot.forEach(doc => {
        this.entradas.push(doc.data());
      });
    })
    .then(() => {
      db.collection("blog")
        .limit(2)
        .orderBy("id")
        .startAfter(this.last)
        .get()
        .then(query => {
          if (query.empty) {
            this.desactivar = true;
          }
        });
    });
}
```

```html
<v-container>
  <v-btn @click="siguiente" :disabled="desactivar">Más artículos...</v-btn>
</v-container>
```