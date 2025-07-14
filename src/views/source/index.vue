<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.source_site" placeholder="源站" class="filter-item" style="width: 200px;" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.channel_name" placeholder="频道名称" class="filter-item" style="width: 200px;" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column prop="id" label="ID" width="60" align="center" />
      <el-table-column prop="source_site" label="源站" />
      <el-table-column prop="channel_name" label="频道名称" />
      <el-table-column prop="base_address" label="基础地址" />
      <el-table-column prop="backup_address" label="备用地址" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
          <el-button size="mini" @click="handleViewAddresses(row)">地址</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="dialogStatus==='create'? '新增信源' : '编辑信源'" :visible.sync="dialogFormVisible">
      <el-form :model="temp" label-width="80px" ref="dataForm">
        <el-form-item label="源站">
          <el-input v-model="temp.source_site" />
        </el-form-item>
        <el-form-item label="频道名称">
          <el-input v-model="temp.channel_name" />
        </el-form-item>
        <el-form-item label="基础地址">
          <el-input v-model="temp.base_address" />
        </el-form-item>
        <el-form-item label="备用地址">
          <el-input v-model="temp.backup_address" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="地址列表" :visible.sync="addressDialogVisible" width="800px">
      <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddAddress" style="margin-bottom:10px;">新增地址</el-button>
      <el-table :data="addressList" border fit highlight-current-row style="width:100%">
        <el-table-column prop="address" label="地址" />
        <el-table-column prop="output_codec" label="编码" width="80" />
        <el-table-column prop="output_category" label="类别" width="80" />
        <el-table-column prop="output_bitrate" label="码率" width="80" />
        <el-table-column prop="output_resolution" label="分辨率" width="100" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" @click="editAddress(row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteAddress(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible=false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="addressDialogStatus==='create'?'新增地址':'编辑地址'" :visible.sync="addressFormVisible">
      <el-form :model="addressForm" label-width="80px" ref="addressFormRef">
        <el-form-item label="地址">
          <el-input v-model="addressForm.address" />
        </el-form-item>
        <el-form-item label="编码">
          <el-input v-model="addressForm.output_codec" />
        </el-form-item>
        <el-form-item label="类别">
          <el-input v-model="addressForm.output_category" />
        </el-form-item>
        <el-form-item label="码率">
          <el-input v-model="addressForm.output_bitrate" />
        </el-form-item>
        <el-form-item label="分辨率">
          <el-input v-model="addressForm.output_resolution" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addressForm.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addressFormVisible=false">取消</el-button>
        <el-button type="primary" @click="addressDialogStatus==='create'?createAddress():updateAddressData()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchSources, addSource, updateSource, deleteSource, fetchAddresses, addAddress, updateAddress, deleteAddress } from '@/api/source'
import Pagination from '@/components/Pagination'

export default {
  name: 'SourceList',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      listQuery: { page: 1, limit: 10, source_site: '', channel_name: '' },
      dialogFormVisible: false,
      dialogStatus: 'create',
      temp: { id: undefined, source_site: '', channel_name: '', base_address: '', backup_address: '', remark: '' },
      addressDialogVisible: false,
      addressList: [],
      currentSourceId: null,
      addressFormVisible: false,
      addressDialogStatus: 'create',
      addressForm: { id: undefined, address: '', output_codec: '', output_category: '', output_bitrate: '', output_resolution: '', remark: '' }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchSources(this.listQuery).then(res => {
        this.list = res.data
        this.total = res.count
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.temp = { source_site: '', channel_name: '', base_address: '', backup_address: '', remark: '' }
      this.dialogFormVisible = true
    },
    createData() {
      addSource(this.temp).then(() => {
        this.dialogFormVisible = false
        this.getList()
      })
    },
    handleEdit(row) {
      this.dialogStatus = 'update'
      this.temp = Object.assign({}, row)
      this.dialogFormVisible = true
    },
    updateData() {
      updateSource(this.temp.id, this.temp).then(() => {
        this.dialogFormVisible = false
        this.getList()
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除该信源吗？', '提示').then(() => {
        deleteSource(row.id).then(() => {
          this.getList()
        })
      }).catch(() => {})
    },
    handleViewAddresses(row) {
      this.currentSourceId = row.id
      fetchAddresses(row.id).then(res => {
        this.addressList = res.data
        this.addressDialogVisible = true
      })
    },
    handleAddAddress() {
      this.addressDialogStatus = 'create'
      this.addressForm = { address: '', output_codec: '', output_category: '', output_bitrate: '', output_resolution: '', remark: '' }
      this.addressFormVisible = true
    },
    createAddress() {
      addAddress(this.currentSourceId, this.addressForm).then(() => {
        this.addressFormVisible = false
        this.handleViewAddresses({ id: this.currentSourceId })
      })
    },
    editAddress(row) {
      this.addressDialogStatus = 'update'
      this.addressForm = Object.assign({}, row)
      this.addressFormVisible = true
    },
    updateAddressData() {
      updateAddress(this.addressForm.id, this.addressForm).then(() => {
        this.addressFormVisible = false
        this.handleViewAddresses({ id: this.currentSourceId })
      })
    },
    deleteAddress(row) {
      this.$confirm('确认删除该地址吗？', '提示').then(() => {
        deleteAddress(row.id).then(() => {
          this.handleViewAddresses({ id: this.currentSourceId })
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.filter-container {
  padding-bottom: 20px;
}
</style>
