<template>
  <div :class="[{ 'container': !allowAccess }]">
    <div class="wallet-connection" v-if="!allowAccess">
      <vue-metamask
          @onComplete="onComplete"
      />
      <div class="wallet" v-if="wallet === null">
        <img class="logo-wallet" src="./assets/logo.png" />
        <h2>Connecting wallet...</h2>
        <p>You need to have 10,000 waifus and the <a href="https://metamask.io/" target="_blank">Metamask extension</a>.</p>
        <p>You can log out by disconecting your wallet.</p>
      </div>

      <div class="wallet" v-else>
        <img class="logo-wallet" src="./assets/logo.png" />

        <div v-if="allowAccess === false && loadingAccess === false">
          <h2>Sorry, you need at least 10,000 WAIF to access this site.</h2>
        </div>

        <div v-else-if="allowAccess">
          <h2>Access Granted</h2>
        </div>

        <div v-else-if="loadingAccess">
          <h2>Authenticating Wallet...</h2>
        </div>

        <div v-else >
          <h2>Wallet not connected.</h2>
        </div>
      </div>
    </div>
    <div id="app" v-else>
      <div id="nav">
        <router-link to="/"><img class="logo" src="./assets/logo.png"/></router-link>

        <div class="right-nav">
          <input  v-if="!uploadFile && !this.$store.state.isError" type="file" id="myFile" accept="image/*" v-on:change="upload" />

          <div v-if="uploadFile">
            <img src="./assets/loading.gif" width=20 height=20 v-if="uploading" />

            <div class="upload-buttons" v-else>
              <button @click="startUploading">Upload</button>

              <button @click="cancelUpload">Cancel</button>
            </div>
          </div>

          <a id="wallet-id" v-bind:href="walletLink" target="_blank">{{wallet}}</a>
          <router-link to="/about">About</router-link>
        </div>
      </div>

      <router-view/>
    </div>
  </div>
</template>

<script>
import VueMetamask from 'vue-metamask'
import * as firebase from 'firebase/app'
import Web3 from 'web3'

export default {
  components: {
    VueMetamask
  },

  data () {
    return {
      wallet: null,
      uploadFile: null,
      uploading: false,
      loadingAccess: false,
      allowAccess: false
    }
  },

  computed: {
    walletLink () {
      return 'https://etherscan.io/token/0xB2279B6769CFBa691416F00609b16244c0cF4b20?a=' + this.wallet
    }
  },

  methods: {
    onComplete (data) {
      if (data) {
        this.wallet = data.metaMaskAddress

        this.checkBalance()
      }
    },

    upload () {
      var x = document.getElementById('myFile')
      if ('files' in x) {
        for (var i = 0; i < x.files.length; i++) {
          this.uploadFile = x.files[i]
        }
      }
    },

    startUploading () {
      this.uploading = true
      var date = new Date()
      var timestamp = date.getTime()
      var regexAll = /[^\\]*\.(\w+)$/
      var total = this.uploadFile.name.match(regexAll)

      const storageRef = firebase.storage().ref(`${timestamp}.${total[1]}`).put(this.uploadFile)
      storageRef.on('state_changed', snapshot => {
        this.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      }, error => { console.log(error.message) },
      () => {
        this.uploadValue = 100
        storageRef.snapshot.ref.getDownloadURL().then((url) => {
          this.$store.commit('addFile', url)
          this.uploading = false
          this.uploadFile = null
        })
      })
    },

    async checkBalance () {
      this.loadingAccess = true
      const tokenAddress = '0xB2279B6769CFBa691416F00609b16244c0cF4b20'
      const walletAddress = this.wallet
      const web3 = new Web3(window.ethereum)
      const minABI = [{
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function'
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        type: 'function'
      }]

      const contract = web3.eth.contract(minABI).at(tokenAddress)

      contract.balanceOf(walletAddress, (error, balance) => {
        if (error) {
          console.log(error)
        }

        contract.decimals((error, decimals) => {
          if (error) {
            console.log(error)
          }

          balance = balance.div(10 ** decimals)
          this.allowAccess = balance >= 10000
          this.loadingAccess = false
        })
      })
    },

    cancelUpload () {
      this.uploadFile = null
    }
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}

#nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: black;
  position: fixed;
  width: 100%;
  height: 55px;
}

#nav a {
  font-weight: bold;
  color: white;
  padding: 0 10px;
}

#myFile {
  width: 100px;
}

.logo {
  height: 40px;
}

.right-nav{
  display:flex;
  justify-content: space-between;
  width: 600px;
}

.upload-buttons {
  display: flex;
  justify-content: space-between;
  width: 140px;
}

.container {
  background: -webkit-linear-gradient(white,red);
  background: -moz-linear-gradient(white, red);
  background: -o-linear-gradient(white,red);
  background: linear-gradient(white,red);

  -webkit-transition: background 1s ease-out;
  -moz-transition: background 1s ease-out;
  -o-transition: background 1s ease-out;
  transition: background 1s ease-out;
}

.wallet-connection {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.wallet {
  display: flex;
  justify-content: space-between;
  height: 20%;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 5px solid black;
  border-radius: 20px;
  padding: 100px;
}

.logo-wallet {
  width: 300px;
}

@media only screen and (max-width: 768px) {
  #nav {
    display:flex;
    flex-direction: column;
    height: 105px;
  }

  #wallet-id {
    display: none;
  }

  .right-nav{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    width: 100%;
  }

  .wallet {
    padding: 10px;
  }
}
</style>
