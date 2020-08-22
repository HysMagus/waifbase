<template>
  <div class="component">
    <div class="loading" v-if="loading">
      <h2>Loading...</h2>
      <img src="../assets/loading.gif"/>
    </div>

    <div class="loading" v-else-if="this.error">
      <h2>{{ this.error }}</h2>
      <img src="../assets/waifbase-chan.png"/>
      <h2>We appreciate your patience.</h2>
    </div>

    <a v-else :href="item" target="_blank" v-for="item in this.$store.state.allFiles" :key="item">
      <img :src="item" />
    </a>
  </div>
</template>

<script>
import firebase from 'firebase'

export default {
  components: {

  },

  data () {
    return {
      allFiles: [],
      loading: false,
      error: ''
    }
  },

  created () {
    this.loading = true

    firebase.auth().signInAnonymously().then(() => {
      firebase.storage().ref().listAll().then((result) => {
        result.items.forEach((imageRef) => {
          imageRef.getDownloadURL().then((url) => {
            if (this.$store.state.allFiles.indexOf(url) === -1) {
              this.$store.commit('addFile', url)
            }

            this.loading = false
          })
        })
      }).catch(() => {
        this.$store.commit('isError', true)
        this.error = 'Please come back tomorrow, we ran out of bandwidth for today.'
        this.loading = false
      })
    })
  }
}

</script>

<style scoped>
.component {
  display: flex;
  flex-wrap: wrap;
  padding-top: 55px;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

a {
  width: 25%;
  height: 400px;
  padding: 0;
  margin: 0;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color:black;
  flex-direction:column;
  width: 100%;
  height: 100vh;
}

.loading h2 {
  color: white;
}

.loading img {
  width: 200px;
  height: 200px;
}

@media only screen and (max-width: 768px) {
  .component {
    padding-top: 105px;
  }

  a {
    width: 50%;
    height: 200px;
    padding: 0;
    margin: 0;
  }

  h2 {
    text-align: center;
    font-size: 5vw;
  }
}

</style>
