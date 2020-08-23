<template>
  <div class="component">
    <div class="loading" v-if="loading">
      <h2>Loading...</h2>
      <img src="../assets/loading.gif"/>
    </div>

    <div class="loading" v-else-if="this.error">
      <h2>{{ this.error }}</h2>
      <img src="../assets/waifbase-chan.png"/>
      <h2>{{ errorPhrases[pickedError] }}</h2>
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
      error: '',
      pickedError: 0,
      errorPhrases: [
        'I appreciate your patience desu.',
        'N..not like I wanted to give you memes or anything, baka.',
        'Eeeeeh? someone before you stole all the memes!',
        'You are too late. lol',
        'Nothing personal kid.',
        'Probably for the best, you really don\'t wanna see what\'s behind me.',
        'Ayaya!',
        'If you really want to destroy a man, you don\'t need to kill him. You just need to close the Waifbase.',
        'You can rely on me!! ...tomorrow that is.',
        'We were born just in time to witness the Waifu age!',
        'Don\t ever give up!',
        'I\'m always alone, too.'
      ]
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
        this.pickedError = Math.floor((Math.random() * 10) + 1) - 1
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
