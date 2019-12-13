# Wordpress API
Veamos como utilizar Wordpress en nuestros proyectos con Vue.js

<iframe width="560" height="315" src="https://www.youtube.com/embed/NBWRdxDhE6k" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Documentacion: [https://developer.wordpress.org/rest-api/reference/](https://developer.wordpress.org/rest-api/reference/)

## Instalar Wordpress

1. Descargar el paquete y descomprimir en su servidor de PHP. [https://es.wordpress.org/download/](https://es.wordpress.org/download/) 
2. Crear una base de datos en PHPMyAdmin
3. Instalar Wordpress

## Ajuste Enlaces
En nuestra administración de wordpress configurar los enlaces permanentes: 
1. Ir a: **Ajustes->Enlaces permanentes->Nombre de la entrada**

## Postman
Hacer la siguiente petición GET: `/wp-json/wp/v2/posts`
```
http://localhost:80/nombre-proyecto/wp-json/wp/v2/posts
```
Deberías estar visualizando esto:
```json
[
    {
        "id": 1,
        "date": "2019-10-28T15:19:29",
        "date_gmt": "2019-10-28T14:19:29",
        "guid": {
            "rendered": "http://localhost/wordpress-api/wordpress-1/wordpress/?p=1"
        },
        "modified": "2019-10-28T15:19:29",
        "modified_gmt": "2019-10-28T14:19:29",
        "slug": "hola-mundo",
        "status": "publish",
        "type": "post",
        "link": "http://localhost/wordpress-api/wordpress-1/wordpress/hola-mundo/",
        "title": {
            "rendered": "¡Hola, mundo!"
        },
        "content": {
            "rendered": "\n<p>Bienvenido a WordPress. Esta es tu primera entrada. Edítala o bórrala, ¡luego empieza a escribir!</p>\n",
            "protected": false
        },
        "excerpt": {
            "rendered": "<p>Bienvenido a WordPress. Esta es tu primera entrada. Edítala o bórrala, ¡luego empieza a escribir!</p>\n",
            "protected": false
        },
        "author": 1,
        "featured_media": 0,
        "comment_status": "open",
        "ping_status": "open",
        "sticky": false,
        "template": "",
        "format": "standard",
        "meta": [],
        "categories": [
            1
        ],
        "tags": [],
        "_links": {...}
    }
]
```
Ya está funcionando nuestra API!

## JWT
1. Ir a **Plugings->Añadir nuevo->JWT Authentication for WP REST API** e instalar
2. Abrir `.htaccess` y agregar:
```{9-11}
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /wordpress-api/wordpress-1/wordpress/
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /wordpress-api/wordpress-1/wordpress/index.php [L]
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
</IfModule>

# END WordPress
```
3. Abrir `wp-config` y agregar:
```
define('JWT_AUTH_SECRET_KEY', 'your-top-secret-key');
define('JWT_AUTH_CORS_ENABLE', true);
```

## Obtener Token
Hacer la siguiente petición POST:
```
http://localhost:80/nombre-proyecto/wp-json/jwt-auth/v1/token
```
Agregar Headers: 
```
Content-Type      application/json
```
Body raw:
```json
{
	"username": "bluuweb",
	"password": "123123"
}
```
Y tendrás como respuesta: 
```json
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3RcL3dvcmRwcmVzcy1hcGlcL3dvcmRwcmVzcy0xXC93b3JkcHJlc3MiLCJpYXQiOjE1NzIyNzQ4NzgsIm5iZiI6MTU3MjI3NDg3OCwiZXhwIjoxNTcyODc5Njc4LCJkYXRhIjp7InVzZXIiOnsiaWQiOiIxIn19fQ.7eG3MIBl6ITJ26xEfNJDpnwykdpiNXoxaP_zC-9qhxk",
    "user_email": "contacto@bluuweb.cl",
    "user_nicename": "bluuweb",
    "user_display_name": "bluuweb"
}
```

## POST: Crear entrada
Hacer la siguiente petición POST:
```
http://localhost:80/nombre-proyecto/wp-json/wp/v2/posts
```
Headers:
```
Authorization
Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3RcL3dvcmRwcmVzcy1hcGlcL3dvcmRwcmVzcy0xXC93b3JkcHJlc3MiLCJpYXQiOjE1NzIyNzQ4NzgsIm5iZiI6MTU3MjI3NDg3OCwiZXhwIjoxNTcyODc5Njc4LCJkYXRhIjp7InVzZXIiOnsiaWQiOiIxIn19fQ.7eG3MIBl6ITJ26xEfNJDpnwykdpiNXoxaP_zC-9qhxk
```
Body x-www-form-urlrencoded
```
title     Entrada prueba 1
content   Entrada prueba 1 contenido
status    publish
```

## Instalación Vue CLI

Hacer este paso solo si no tienes instalado Vue CLI

```
npm install @vue/cli -g
```

## Nuevo proyecto de Vue

```
vue create app-wordpress-api
cd app-wordpress-api
```

## Agregar Vuetify

```
vue add vuetify
```

## Vue-axios
[https://www.npmjs.com/package/vue-axios](https://www.npmjs.com/package/vue-axios)

```
npm install --save axios vue-axios
```

```js
import axios from 'axios'
import VueAxios from 'vue-axios'
 
Vue.use(VueAxios, axios)

// Agregamos la URL base de nuestra API
axios.defaults.baseURL = 'http://localhost:80/nombre-proyecto/';
```

## App.vue
```html
<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data: () => ({
    //
  }),
};
</script>
```

## router/index.js
```js
{
  path: '/crud',
  name: 'crud',
  component: () => import(/* webpackChunkName: "about" */ '../views/Crud.vue')
},
```
## Table Vuetify
Agregar tabla CRUD [https://vuetifyjs.com/en/components/data-tables#crud-actions](https://vuetifyjs.com/en/components/data-tables#crud-actions) y reemplazar datos: 

```
desserts => entradas
name => title
calories => id
fat => content
carbs => date
protein => status
```

## initialize()
Vamos a modificar el método que llena nuestra base de datos:
```js
async initialize () {
  const entradasDB = await this.axios.get('wp-json/wp/v2/posts');
  // console.log(entradasDB.data);
  await entradasDB.data.forEach(element => {
    console.log(element);
    let item = {}
    item.id = element.id;
    item.date = element.date;
    item.status = element.status;
    item.content = this.limpiar(element.content.rendered);
    item.title = element.title.rendered;
    this.entradas.push(item)
  })
},
// Para limpiar <p> del content
limpiar(value){
  return value.replace(/<\/?[^>]+(>|$)/g, "")
},
```

## POST (Agregar)
```html
<v-card-text>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="editedItem.title" label="title"></v-text-field>
      </v-col>
      <v-col cols="12">
        <v-text-field type="text" v-model="editedItem.content" label="content"></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</v-card-text>
```

```js
// Agregar en DATA
config:{
  headers: {
    Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3RcL3dvcmRwcmVzcy1hcGlcL3dvcmRwcmVzcy0xXC93b3JkcHJlc3MiLCJpYXQiOjE1NzIyNzQ4NzgsIm5iZiI6MTU3MjI3NDg3OCwiZXhwIjoxNTcyODc5Njc4LCJkYXRhIjp7InVzZXIiOnsiaWQiOiIxIn19fQ.7eG3MIBl6ITJ26xEfNJDpnwykdpiNXoxaP_zC-9qhxk'
  }
}
```

```js
async save () {
  if (this.editedIndex > -1) {
    // Editar
    Object.assign(this.entradas[this.editedIndex], this.editedItem)
  } else {
    // Agregar
    console.log(this.editedItem);
    const entrada = {
      title: this.editedItem.title,
      content: this.editedItem.content,
      status: 'publish'
    }
    try {
      const entradaNueva = await this.axios.post('wp-json/wp/v2/posts',entrada, this.config);
      console.log(entradaNueva.data);
      this.editedItem.id = entradaNueva.data.id;  
      this.editedItem.date = entradaNueva.data.date;  
      this.editedItem.status = entradaNueva.data.status;  
    } catch (error) {
      console.log(error);
    }
    this.entradas.push(this.editedItem)
  }
  this.close()
},
```

## POST (Editar)
```js
async save () {
  if (this.editedIndex > -1) {
    // Editar
    Object.assign(this.entradas[this.editedIndex], this.editedItem)
    console.log(this.editedItem);
    try {
      const entradaNueva = await this.axios.post(
                                      `wp-json/wp/v2/posts/${this.editedItem.id}`,
                                      this.editedItem, 
                                      this.config);       
    } catch (error) {
      console.log(error);
    }
  } else {...}
```

## DELETE
```js
async deleteItem (item) {
  const index = this.entradas.indexOf(item)
  const respuesta = confirm('Are you sure you want to delete this item?') && this.entradas.splice(index, 1)

  if(respuesta){
    await this.axios.delete(`wp-json/wp/v2/posts/${item.id}`, this.config);
  }
},
```

## Iconos
```html
<v-icon
  class="mr-2"
  @click="editItem(item)"
  color="blue"
>
  mdi-pencil
</v-icon>
<v-icon
  @click="deleteItem(item)"
  color="red"
>
  mdi-delete
</v-icon>
```

## Código Final
```html
<template>
  <v-data-table
    :headers="headers"
    :items="entradas"
    sort-by="id"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>My CRUD</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.title" label="title"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field type="text" v-model="editedItem.content" label="content"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon
        class="mr-2"
        @click="editItem(item)"
        color="blue"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        @click="deleteItem(item)"
        color="red"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'left',
          sortable: false,
          value: 'title',
        },
        { text: 'id', value: 'id' },
        { text: 'content (g)', value: 'content' },
        { text: 'date (g)', value: 'date' },
        { text: 'status (g)', value: 'status' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      entradas: [],
      editedIndex: -1,
      editedItem: {
        title: '',
        id: 0,
        content: '',
        date: 0,
        status: 0,
      },
      defaultItem: {
        title: '',
        id: 0,
        content: '',
        date: 0,
        status: 0,
      },
      config:{
        headers: {
          Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9sb2NhbGhvc3RcL3dvcmRwcmVzcy1hcGlcL3dvcmRwcmVzcy0xXC93b3JkcHJlc3MiLCJpYXQiOjE1NzIyNzQ4NzgsIm5iZiI6MTU3MjI3NDg3OCwiZXhwIjoxNTcyODc5Njc4LCJkYXRhIjp7InVzZXIiOnsiaWQiOiIxIn19fQ.7eG3MIBl6ITJ26xEfNJDpnwykdpiNXoxaP_zC-9qhxk'
        }
      }
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    created () {
      this.initialize()
    },

    methods: {
      async initialize () {
        const entradasDB = await this.axios.get('wp-json/wp/v2/posts');
        // console.log(entradasDB.data);
        await entradasDB.data.forEach(element => {
          console.log(element);
          let item = {}
          item.id = element.id;
          item.date = element.date;
          item.status = element.status;
          item.content = this.limpiar(element.content.rendered);
          item.title = element.title.rendered;
          this.entradas.push(item)
        })
      },

      limpiar(value){
        return value.replace(/<\/?[^>]+(>|$)/g, "")
      },

      editItem (item) {
        this.editedIndex = this.entradas.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      async deleteItem (item) {
        const index = this.entradas.indexOf(item)
        const respuesta = confirm('Are you sure you want to delete this item?') && this.entradas.splice(index, 1)

        if(respuesta){
          await this.axios.delete(`wp-json/wp/v2/posts/${item.id}`, this.config);
        }
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      async save () {
        if (this.editedIndex > -1) {
          // Editar
          Object.assign(this.entradas[this.editedIndex], this.editedItem)
          console.log(this.editedItem);
          try {
            const entradaNueva = await this.axios.post(
                                            `wp-json/wp/v2/posts/${this.editedItem.id}`,
                                            this.editedItem, 
                                            this.config);       
          } catch (error) {
            console.log(error);
          }
        } else {
          // Agregar
          console.log(this.editedItem);
          const entrada = {
            title: this.editedItem.title,
            content: this.editedItem.content,
            status: 'publish'
          }
          try {
            const entradaNueva = await this.axios.post('wp-json/wp/v2/posts',entrada, this.config);
            console.log(entradaNueva.data);
            this.editedItem.id = entradaNueva.data.id;  
            this.editedItem.date = entradaNueva.data.date;  
            this.editedItem.status = entradaNueva.data.status;  
          } catch (error) {
            console.log(error);
          }
          this.entradas.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>
```