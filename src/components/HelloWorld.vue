<template>
  <div class="hello">
    <h1>{{ currentPage }}</h1>

    <b-card title="Card Title" no-body>
      <b-card-header header-tag="nav">
        <b-nav card-header pills align="center">
          <b-nav-item @click="currentPage = 'Zone'">Zone</b-nav-item>
          <b-nav-item @click="currentPage = 'Building'">Building</b-nav-item>
        </b-nav>
      </b-card-header>

      <b-card-body class="text-center">
        <div v-if="currentPage === 'Zone'">
          <b-button
            class="m-2"
            variant="primary"
            @click="onAddZoneButton()"
            :disabled="!!selected.length"
          >
            Add Zone
          </b-button>
          <b-button
            class="m-2"
            variant="primary"
            @click="onUpdateZoneButton()"
            :disabled="!selected.length"
          >
            Update Zone
          </b-button>
          <b-button
            class="m-2"
            variant="danger"
            @click="onDeleteZoneButton()"
            :disabled="!selected.length"
            danger
          >
            Delete Zone
          </b-button>

          <hr class="vr" style="position: absolute; height: 50px; margin: 0" />

          <b-button
            class="m-2"
            variant="primary"
            @click="onAddBuildingButton()"
            :disabled="!selected.length"
          >
            Add Building
          </b-button>

          <b-table
            class=""
            :items="zones"
            :fields="fields"
            :select-mode="selectMode"
            responsive="sm"
            ref="selectableTable"
            selectable
            @row-selected="onRowSelected"
          >
            <template #cell(selected)="{ rowSelected }">
              <template v-if="rowSelected">
                <span aria-hidden="true">&check;</span>
                <span class="sr-only">Selected</span>
              </template>
              <template v-else>
                <span aria-hidden="true">&nbsp;</span>
                <span class="sr-only">Not selected</span>
              </template>
            </template>
          </b-table>
        </div>
        <div v-if="currentPage === 'Building'">
          <b-button
            class="m-2"
            variant="primary"
            @click="onUpdateBuildingButton()"
            :disabled="!selected.length"
          >
            Update Building
          </b-button>
          <b-button
            class="m-2"
            variant="danger"
            @click="onDeleteBuildingButton()"
            :disabled="!selected.length"
            danger
          >
            Delete Building
          </b-button>

          <b-table
            class=""
            :items="buildings"
            :fields="buildingfields"
            :select-mode="selectMode"
            responsive="sm"
            ref="selectableTable"
            selectable
            @row-selected="onRowSelected"
          >
            <template #cell(selected)="{ rowSelected }">
              <template v-if="rowSelected">
                <span aria-hidden="true">&check;</span>
                <span class="sr-only">Selected</span>
              </template>
              <template v-else>
                <span aria-hidden="true">&nbsp;</span>
                <span class="sr-only">Not selected</span>
              </template>
            </template>
          </b-table>
        </div>
      </b-card-body>
    </b-card>

    <!-- MODAL -->

    <b-modal ref="add-zone-modal" title="Add Zone" hide-footer>
      <b-form>
        <b-form-group class="mb-4" id="input-group-1" label="Area Name:" label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="form.areaName"
            placeholder="center"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group class="mb-4" id="input-group-2" label="Map URL:" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.mapURL"
            placeholder="assets/map/center.json"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group class="mb-4" id="input-group-2" label="Map URL:" label-for="input-2">
          <b-form-textarea
            id="textarea-1"
            v-model="form.areaTileSets"
            rows="6"
            max-rows="9"
          ></b-form-textarea>
        </b-form-group>

        <b-button variant="primary" @click="onAddZoneSubmit()">Submit</b-button>
      </b-form>
    </b-modal>

    <b-modal ref="update-zone-modal" title="Update Zone" hide-footer>
      <b-form>
        <b-form-group class="mb-4" id="input-group-1" label="Area Name:" label-for="input-1">
          <b-form-input
            id="input-1"
            v-model="form.areaName"
            placeholder="center"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group class="mb-4" id="input-group-2" label="Map URL:" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="form.mapURL"
            placeholder="assets/map/center.json"
            required
          ></b-form-input>
        </b-form-group>

        <b-form-group class="mb-4" id="input-group-2" label="Map URL:" label-for="input-2">
          <b-form-textarea
            id="textarea-1"
            v-model="form.areaTileSets"
            rows="6"
            max-rows="9"
          ></b-form-textarea>
        </b-form-group>

        <b-button variant="primary" @click="onUpdateZoneSubmit()">Submit</b-button>
      </b-form>
    </b-modal>

    <b-modal ref="add-building-modal" title="Add Building" hide-footer>
      <b-form>
        <b-form-group class="mb-4" id="input-group-1" label="Coordinate" label-for="input-1">
          <b-row class="d-flex">
            <b-form-input
              id="input-1"
              class="w-25 mr-sm-2 mb-sm-0"
              v-model="form.x"
              placeholder="x"
              style="margin-left: 10px; margin-right: 20px"
              type="number"
              required
            ></b-form-input>
            <b-form-input
              id="input-2"
              class="w-25 mr-sm-2"
              v-model="form.y"
              placeholder="y"
              type="number"
              required
            ></b-form-input>
          </b-row>
        </b-form-group>

        <b-form-group class="mb-4" id="input-group-3" label="Zone:" label-for="input-3">
          <b-form-input
            id="input-3"
            class="mb-2 mr-sm-2 mb-sm-0"
            v-model="form.zoneId"
            placeholder="y"
            disabled
          ></b-form-input>
        </b-form-group>

        <b-form-group class="mb-4" id="input-group-2" label="type:" label-for="input-2">
          <b-form-select
            class="pr-4"
            v-model="form.sprite.type"
            :options="['image', 'spritesheet']"
          ></b-form-select>
        </b-form-group>

        <b-form-group class="mb-4" id="input-group-2" label="image:">
          <b-form-input
            class="mb-2 mr-sm-2"
            v-model="form.sprite.image.url"
            placeholder="URL"
          ></b-form-input>
          <b-form-input
            class="mb-2 mr-sm-2"
            v-model="form.sprite.image.frameWidth"
            type="number"
            placeholder="Frame Width"
          ></b-form-input>
          <b-form-input
            class="mb-2 mr-sm-2"
            v-model="form.sprite.image.frameHeight"
            type="number"
            placeholder="Frame Height"
          ></b-form-input>
          <b-form-input
            class="mb-2 mr-sm-2"
            v-model="form.sprite.image.scale"
            type="number"
            placeholder="Scale"
          ></b-form-input>
        </b-form-group>

        <template v-if="form.sprite.type === 'spritesheet'">
          <b-form-group class="mb-4" id="input-group-2" label="animations:">
            <b-form-input
              class="mb-2 mr-sm-2"
              v-model="form.sprite.animations.start"
              type="number"
              placeholder="Start"
            ></b-form-input>
            <b-form-input
              class="mb-2 mr-sm-2"
              v-model="form.sprite.animations.end"
              type="number"
              placeholder="End"
            ></b-form-input>
            <b-form-input
              class="mb-2 mr-sm-2"
              v-model="form.sprite.animations.frameRate"
              type="number"
              placeholder="Frame Rate"
            ></b-form-input>
            <b-form-input
              class="mb-2 mr-sm-2"
              v-model="form.sprite.animations.repeat"
              type="number"
              placeholder="Repeat"
            ></b-form-input>
          </b-form-group>
        </template>

        <b-button variant="primary" @click="onAddBuildingSubmit()">Submit</b-button>
      </b-form>
    </b-modal>

    <b-modal ref="update-building-modal" title="Update Building" hide-footer>
      <b-form>
        <b-form-group class="mb-4" id="input-group-1" label="Coordinate" label-for="input-1">
          <b-row class="d-flex">
            <b-form-input
              id="input-1"
              class="w-25 mr-sm-2 mb-sm-0"
              v-model="form.x"
              placeholder="x"
              style="margin-left: 10px; margin-right: 20px"
              type="number"
              required
            ></b-form-input>
            <b-form-input
              id="input-2"
              class="w-25 mr-sm-2"
              v-model="form.y"
              placeholder="y"
              type="number"
              required
            ></b-form-input>
          </b-row>
        </b-form-group>

        <b-form-group class="mb-4" id="input-group-3" label="Zone:" label-for="input-3">
          <b-form-input
            id="input-3"
            class="mb-2 mr-sm-2 mb-sm-0"
            v-model="form.zoneId"
            placeholder="y"
            disabled
          ></b-form-input>
        </b-form-group>

        <b-form-group class="mb-4" id="input-group-2" label="type:" label-for="input-2">
          <b-form-select
            class="pr-4"
            v-model="form.sprite.type"
            :options="['image', 'spritesheet']"
          ></b-form-select>
        </b-form-group>

        <b-form-group class="mb-4" id="input-group-2" label="image:">
          <b-form-input
            class="mb-2 mr-sm-2"
            v-model="form.sprite.image.url"
            placeholder="URL"
          ></b-form-input>
          <b-form-input
            class="mb-2 mr-sm-2"
            v-model="form.sprite.image.frameWidth"
            type="number"
            placeholder="Frame Width"
          ></b-form-input>
          <b-form-input
            class="mb-2 mr-sm-2"
            v-model="form.sprite.image.frameHeight"
            type="number"
            placeholder="Frame Height"
          ></b-form-input>
          <b-form-input
            class="mb-2 mr-sm-2"
            v-model="form.sprite.image.scale"
            type="number"
            placeholder="Scale"
          ></b-form-input>
        </b-form-group>

        <template v-if="form.sprite.type === 'spritesheet'">
          <b-form-group class="mb-4" id="input-group-2" label="animations:">
            <b-form-input
              class="mb-2 mr-sm-2"
              v-model="form.sprite.animations.start"
              type="number"
              placeholder="Start"
            ></b-form-input>
            <b-form-input
              class="mb-2 mr-sm-2"
              v-model="form.sprite.animations.end"
              type="number"
              placeholder="End"
            ></b-form-input>
            <b-form-input
              class="mb-2 mr-sm-2"
              v-model="form.sprite.animations.frameRate"
              type="number"
              placeholder="Frame Rate"
            ></b-form-input>
            <b-form-input
              class="mb-2 mr-sm-2"
              v-model="form.sprite.animations.repeat"
              type="number"
              placeholder="Repeat"
            ></b-form-input>
          </b-form-group>
        </template>

        <b-button variant="primary" @click="onUpdateBuildingSubmit()">Submit</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import * as bip39 from '../bundle/bip39.bundle'

const API_PATH = 'https://test.ipdb.io/api/v1/'
const conn = new BigchainDB.Connection(API_PATH)

export default {
  name: 'HelloWorld',

  data() {
    return {
      currentPage: 'Zone',
      zoneAssetId: 'a641f38a0e1719c92b30184754af4a69079f17915befed989d186ab8854bebd9',
      buildingAssetId: '0d164fab996e3f2e596eedb8bdf7e98e9155348252cfcb6d85b93ba946fee2cc',
      owner: {
        publicKey: 'CcmxpsvBJ9y8trdm8w3FVd42tMANWjb923EFENCjkY16',
        privateKey: '87VR1BjRvoo9jzMLSgfaywmxxchHnieL4k7LCfKAa5RF',
      },
      form: {
        rootId: '',
        areaName: '',
        mapURL: '',
        areaTileSets: [
          {
            id: 1,
            name: 'Partner-Tileset',
            tilesetURL: 'assets/map/Partner-Tileset_extruded.png',
          },
          {
            id: 2,
            name: 'tileset',
            tilesetURL: 'assets/map/tileset_extruded.png',
          },
          {
            id: 3,
            name: 'tileset-2',
            tilesetURL: 'assets/map/tileset-2_extruded.png',
          },
        ],
        zoneId: '',
        x: '',
        y: '',
        sprite: {
          type: 'spritesheet',
          image: {
            url: '',
            frameWidth: 702,
            frameHeight: 454,
            scale: 1,
          },
          animations: {
            start: '',
            end: '',
            frameRate: '',
            repeat: '',
          },
        },
      },

      building: {
        x: '',
        y: '',
        zoneId: '',
        sprite: {},
      },

      modes: ['multi', 'single', 'range'],
      fields: ['selected', 'asset_id', 'metadata', 'owner'],
      buildingfields: ['selected', 'asset_id', 'zone_id', 'metadata', 'owner'],
      zones: [],
      buildings: [],

      selectMode: 'single',
      selected: [],
    }
  },

  mounted() {
    // this.createParentAsset()
    this.getAllZone()
    this.getAllBuilding()
  },

  methods: {
    updateCurrentPage(page) {
      this.currentPage = page
    },

    onRowSelected(items) {
      console.log(items)
      this.selected = items
    },

    onAddZoneButton() {
      this.$refs['add-zone-modal'].show()
    },

    onUpdateZoneButton() {
      const selected = this.selected[0]

      this.form.id = selected.id
      this.form.areaName = selected.metadata.areaName
      this.form.mapURL = selected.metadata.mapURL
      this.form.areaTileSets = selected.metadata.areaTileSets

      this.$refs['update-zone-modal'].show()
    },

    onDeleteZoneButton() {
      const selected = this.selected[0]

      this.deleteParentAsset(this.zoneAssetId, selected)
    },

    /* -------------------------------------------------------------------------- */
    /*                                  Zone CRUD                                 */
    /* -------------------------------------------------------------------------- */

    onAddZoneSubmit() {
      let metadata = {
        areaId: 1,
        areaName: this.form.areaName,
        mapURL: this.form.mapURL,
        areaTileSets: JSON.parse(JSON.stringify(this.form.areaTileSets)),
      }
      
      console.log("onAddZoneSubmit_start")
      console.log(this.zoneAssetId)

      this.createSingleAsset(this.zoneAssetId, metadata)
    },

    onUpdateZoneSubmit() {
      let metadata = {
        areaId: 1,
        areaName: this.form.areaName,
        mapURL: this.form.mapURL,
        areaTileSets: JSON.parse(JSON.stringify(this.form.areaTileSets)),
      }

      this.updateSingleAsset(metadata, this.selected[0])
    },

    onAddBuildingButton() {
      this.form.zoneId = this.selected[0].metadata.areaName

      this.$refs['add-building-modal'].show()
    },

    onUpdateBuildingButton() {
      const selected = this.selected[0]

      this.form.id = selected.id
      this.form.x = selected.metadata.x
      this.form.y = selected.metadata.y
      this.form.zoneId = selected.metadata.zoneId
      this.form.sprite = selected.metadata.sprite

      this.$refs['update-building-modal'].show()
    },

    onDeleteBuildingButton() {
      const selected = this.selected[0]

      this.deleteParentAsset(this.buildingAssetId, selected)
    },

    /* -------------------------------------------------------------------------- */
    /*                                Building CRUD                               */
    /* -------------------------------------------------------------------------- */

    onAddBuildingSubmit() {
      let sprite =
        this.form.sprite.type === 'image'
          ? { type: this.form.sprite.type, image: this.form.sprite.image }
          : {
              type: this.form.sprite.type,
              image: this.form.sprite.image,
              animations: this.form.sprite.animations,
            }

      let metadata = {
        id: this.$uuid.v4(),
        x: this.form.x,
        y: this.form.y,
        zoneId: this.form.zoneId,
        sprite: sprite,
      }

      this.createSingleAsset(this.buildingAssetId, metadata)
    },

    onUpdateBuildingSubmit() {
      let sprite =
        this.form.sprite.type === 'image'
          ? { type: this.form.sprite.type, image: this.form.sprite.image }
          : {
              type: this.form.sprite.type,
              image: this.form.sprite.image,
              animations: this.form.sprite.animations,
            }

      let metadata = {
        id: this.$uuid.v4(),
        x: this.form.x,
        y: this.form.y,
        zoneId: this.form.zoneId,
        sprite: sprite,
      }

      this.updateSingleAsset(metadata, this.selected[0])
    },

    /* -------------------------------------------------------------------------- */
    /*                               Function Section                             */
    /* -------------------------------------------------------------------------- */

    async createSingleAsset(parentAssetId, metadata) {
      const tx = BigchainDB.Transaction.makeCreateTransaction(
        { role: 'admin' },
        metadata,
        [
          BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(this.owner.publicKey),
          ),
        ],
        this.owner.publicKey,
      )
      console.log("this_is_private_key")
      console.log(this.owner.privateKey)

      const txSigned = BigchainDB.Transaction.signTransaction(tx, this.owner.privateKey)

      let assetCreated = await conn.postTransactionCommit(txSigned)
      console.log("asset_created")
      console.log(assetCreated)
// Check 1
      await this.updateOperationToTranfser(assetCreated)
// Check 2
      await this.updateParentAsset(parentAssetId, assetCreated)

      console.log(assetCreated)
      this.getAllZone()
      this.getAllBuilding()

      this.$refs['add-zone-modal'].hide()
      this.$refs['add-building-modal'].hide()
    },

    async updateSingleAsset(metadata, data) {
      let txCreated = await conn.getTransaction(data.asset_id)

      const updatedBuilding = BigchainDB.Transaction.makeTransferTransaction(
        [
          {
            tx: txCreated,
            output_index: 0,
          },
        ],
        [
          BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(this.owner.publicKey),
          ),
        ],
        metadata,
      )

      const signedTransfer = BigchainDB.Transaction.signTransaction(
        updatedBuilding,
        this.owner.privateKey,
      )

      let res = await conn.postTransactionCommit(signedTransfer)

      this.$refs['update-zone-modal'].hide()
      this.$refs['update-building-modal'].hide()
      this.getAllZone()
      this.getAllBuilding()
    },

    getAllZone() {
      this.getParentAsset(this.zoneAssetId, 'zone')
    },

    getAllBuilding() {
      this.getParentAsset(this.buildingAssetId, 'building')
    },

    async updateParentAsset(parentAssetId, childAsset) {
      console.log("updateParentAsset_start")
      console.log(parentAssetId)// parent id is the original asset of the data somewhat like a table
      console.log(childAsset)

      let txCreated = await this.fetchLatestTransaction(parentAssetId)

      console.log("txCreated_start")
      console.log(txCreated)

      let updatedMetadata = txCreated.metadata.data
      console.log("updatedMetadata_start")
      console.log(updatedMetadata)
      updatedMetadata.push({ id: childAsset.id, name: childAsset.metadata.areaName })
      console.log("updatedMetadata_start_1")
      console.log(updatedMetadata)
      const assetTx = BigchainDB.Transaction.makeTransferTransaction(
        [
          {
            tx: txCreated,
            output_index: 0,
          },
        ],
        [
          BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(this.owner.publicKey),
          ),
        ],
        { data: updatedMetadata },
      )

      const signedTransfer = BigchainDB.Transaction.signTransaction(assetTx, this.owner.privateKey)

      console.log("updateParentAsset_exit")

      let res = await conn.postTransactionCommit(signedTransfer)

      return res
    },

    async deleteParentAsset(parentAssetId, childMetadata) {
      let txCreated = await this.fetchLatestTransaction(parentAssetId)
      let updatedMetadata = txCreated.metadata.data

      let index = updatedMetadata.findIndex(el => el.id === childMetadata.rootId)

      if (index === -1) return

      updatedMetadata.splice(index, 1)

      const assetTx = BigchainDB.Transaction.makeTransferTransaction(
        [
          {
            tx: txCreated,
            output_index: 0,
          },
        ],
        [
          BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(this.owner.publicKey),
          ),
        ],
        { data: updatedMetadata },
      )

      const signedTransfer = BigchainDB.Transaction.signTransaction(assetTx, this.owner.privateKey)

      let res = await conn.postTransactionCommit(signedTransfer)

      this.getAllZone()
      this.getAllBuilding()

      return res
    },

    async getParentAsset(assetId, mode) {
      console.log("assetId_print")
      console.log(assetId)
      let retrievedTransaction = await conn.searchAssets(assetId)
      let data = {}
      console.log("retrievedTransaction_print")
      console.log(retrievedTransaction)
      data.asset = retrievedTransaction[0]
      let metadata = await this.getSortedTransaction(assetId)
      console.log("metadata_print")
      console.log(metadata)
      data.metadata = this.isArray(metadata) ? metadata[0].metadata : metadata.data

      const assets = metadata.data
      console.log("assets_print")
      console.log(assets)
      this.zones = []
      this.buildings = []

      assets.forEach(async asset => {
        let data = await this.fetchLatestTransaction(asset.id)
        console.log("each_asset_print")
        console.log(data)
        if (mode === 'zone') {
          this.zones.push({
            rootId: data.asset.id,
            asset_id: data.id,
            metadata: data.metadata,
            owner: data.inputs[0].owners_before[0],
          })
        } else {
          this.buildings.push({
            rootId: data.asset.id,
            asset_id: data.id,  
            zone_id: data.metadata.zoneId,
            metadata: data.metadata,
            owner: data.inputs[0].owners_before[0],
          })
        }
      })
    },

    async getSortedTransaction(assetId) {
      let metaData = {}
      let txList = await conn.listTransactions(assetId)

      if (txList.length <= 1) return txList

      txList.forEach(tx => {
        for (let key in tx.metadata) {
          metaData[key] = tx.metadata[key]
        }
      })

      return metaData
    },

    isArray(what) {
      return Object.prototype.toString.call(what) === '[object Array]'
    },

    async createParentAsset() {
      let phrase = 'TEST'
      let seed = await bip39.generateSeed(phrase)
      const owner = new window.BigchainDB.Ed25519Keypair(seed)
      this.owner = owner

      const zoneTx = BigchainDB.Transaction.makeCreateTransaction(
        { role: 'admin' },
        { data: [{ id: '', name: '', building: '' }] },
        [
          BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(this.owner.publicKey),
          ),
        ],
        this.owner.publicKey,
      )

      const zoneTxSigned = BigchainDB.Transaction.signTransaction(zoneTx, this.owner.privateKey)

      let zoneCreated = await conn.postTransactionCommit(zoneTxSigned)

      await this.updateOperationToTranfser(zoneCreated)

      console.log('zoneAssetId', zoneCreated)

      const buildingTx = BigchainDB.Transaction.makeCreateTransaction(
        { role: 'admin' },
        { data: [{ id: '', x: '24', y: '', zoneId: '', sprite: {} }] },
        [
          BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(this.owner.publicKey),
          ),
        ],
        this.owner.publicKey,
      )

      const buildingTxSigned = BigchainDB.Transaction.signTransaction(
        buildingTx,
        this.owner.privateKey,
      )

      let buildingCreated = await conn.postTransactionCommit(buildingTxSigned)

      console.log('buildingAssetId', buildingCreated)

      await this.updateOperationToTranfser(buildingCreated)
    },

    async updateOperationToTranfser(txCreated) {
      console.log("update_operation_to_tranfser_start")
      console.log(txCreated.metadata)
      const firstTransferTransaction = BigchainDB.Transaction.makeTransferTransaction(
        [
          {
            tx: txCreated,
            output_index: 0,
          },
        ],
        [
          BigchainDB.Transaction.makeOutput(
            BigchainDB.Transaction.makeEd25519Condition(this.owner.publicKey),
          ),
        ],
        txCreated.metadata,
      )

      const signedTransfer = BigchainDB.Transaction.signTransaction(
        firstTransferTransaction,
        this.owner.privateKey,
      )

      await conn.postTransactionCommit(signedTransfer)
    },

    async fetchLatestTransaction(assetId) {
      console.log("fetchLatestTransaction_start")
      console.log(assetId)
      let list = await fetch(
        `${API_PATH}transactions?asset_id=${assetId}&operation=TRANSFER&last_tx=${true}`,
      )

      console.log(list)

      let data = await list.json()

      console.log("fetchLatestTransaction_exit")
      // Why is data empty when it's already been created at asset_created
      console.log(data)
      return data[0]
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
