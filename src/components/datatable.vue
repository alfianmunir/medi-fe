<script>
export default {
  props: {
    fields: Array,
    tableData: Array,
    label: String,
    onDelete: Boolean,
    onEdit: Boolean,
    onDetail: Boolean,
    onCreate: Boolean,
  },
  data() {
    return {
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "age",
      sortDesc: false,
    };
  },
  computed: {
    rows() {
      return this.tableData.length;
    },
  },
  mounted() {
    this.totalRows = this.items.length;
  },
  methods: {
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    getProgress(data){
      if(!data.project_details) return 0
      if(data.project_details.length < 1) return 0
      return parseFloat(data.project_details.filter(item => (item.STATUS == 'Y')).length) * 100 / parseFloat(data.project_details.length)
    }
  },
  emits: ["add", "create", "detail", "delete", "edit"],
};
</script>

<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-sm-12 col-md-6">
            <div id="tickets-table_length" class="dataTables_length">
              <label class="d-inline-flex align-items-center">
                Show&nbsp;
                <b-form-select
                  v-model="perPage"
                  size="sm"
                  :options="pageOptions"
                ></b-form-select
                >&nbsp;entries
              </label>
            </div>
          </div>
          <!-- Search -->
          <div class="col-sm-12 col-md-6">
            <div id="tickets-table_filter" class="dataTables_filter text-md-right">
              <label class="d-inline-flex align-items-center">
                Search:
                <b-form-input
                  v-model="filter"
                  type="search"
                  placeholder="Search..."
                  class="form-control form-control-sm ml-2"
                ></b-form-input>
              </label>
              <b-button
                variant="primary"
                size="sm"
                class="ml-2"
                v-b-modal.modal
                v-if="$props.onCreate"
                @click="$emit('add')"
              >
                Tambah Data
              </b-button>
            </div>
          </div>
          <!-- End search -->
        </div>
        <b-table
          :items="tableData"
          :fields="fields"
          responsive="sm"
          :per-page="perPage"
          :current-page="currentPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :filter="filter"
          :filter-included-fields="filterOn"
          @filtered="onFiltered"
        >
          <template #table-colgroup="scope">
            <col
              v-for="field in scope.fields"
              :key="field.key"
              :style="{
                width: ['aksi', 'cover', 'USER_COVER'].includes(field.key) ? '100px' : '300px',
              }"
            />
          </template>
          <template #empty="">
            <h5>Tidak ada data ditemukan</h5>
          </template>
          <template #cell(USER_NAME)="data">
            {{ data.item.user.NAME }}
          </template>
          <template #cell(USER_TYPE)="data">
            {{
              data.item.user.TYPE == "P"
                ? "Provinsi"
                : data.item.user.TYPE == "B"
                ? "Kabupaten"
                : data.item.user.TYPE == "C"
                ? "Kecamatan"
                : data.item.user.TYPE == "D"
                ? "Desa"
                : "Warga"
            }}
          </template>
          <template #cell(CREATE_DATE)="data">
            {{ new Date(data.item.CREATE_DATE).toLocaleString() }}
          </template>
          <template #cell(CREATE_BY_PROJ)="data">
            {{ data.item.createdby ? data.item.createdby.NAME : 'Tidak ada' }}
          </template>
          <template #cell(Fin_Budget)="data">
            {{ data.item.finance.AMOUNT }}
          </template>
          <template #cell(Fin_Keterangan)="data">
            {{ data.item.finance.DESCRIPTION }}
          </template>
          <template #cell(NIK)="data">
            {{ data.item.user.NIK }}
          </template>
          <template #cell(ORIGIN)="data">
            {{ data.item.user.user ? data.item.user.user.NAME : "-" }}
          </template>
          <template #cell(KELUHAN)="data">
            {{ data.item.DETAIL }}
          </template>
          <template #cell(STATUS_COMPLAINT)="data">
            {{ data.item.STATUS == "N" ? "Belum Verifikasi" : data.item.STATUS == "T" ? 'Ditolak' : data.item.STATUS == "Y" ? 'Verifikasi' : 'Selesai Survey' }}
          </template>
          <template #cell(STATUS_WARGA)="data">
            <span v-if="data.item.user.STATUS == 'N'">Belum Validasi</span>
            <span v-else-if="data.item.user.STATUS == 'Y'" class="text-success font-weight-bold">Telah Divalidasi</span>
            <span v-else class="text-danger font-weight-bold">Validasi Ditolak</span>
          </template>
          <template #cell(BIRTH_INFO)="data">
            {{ data.item.BIRTH_PLACE }},
            {{ new Date(data.item.BIRTH_DATE).toLocaleString() }}
          </template>
          <template #cell(user)="data">
            {{ data.item.user ? data.item.user.NAME : "-" }}
          </template>
          <template #cell(aksi)="data">
            <b-dropdown dropleft variant="outline-light" size="sm">
              <template #button-content>
                <i class="fa fa-ellipsis-h text-primary" />
              </template>
              <b-dropdown-item
                href="#"
                v-if="$props.onDetail"
                @click="$emit('detail', data.item)"
                ><i class="fa fa-info-circle text-primary mr-2" />Detail</b-dropdown-item
              >
              <b-dropdown-item
                href="#"
                v-if="$props.onEdit"
                v-b-modal.modal
                @click="$emit('edit', data.item)"
                ><i class="fa fa-edit text-warning mr-2" />Edit</b-dropdown-item
              >
              <b-dropdown-item
                href="#"
                v-if="$props.onDelete"
                @click="$emit('delete', data.item)"
                ><i class="fa fa-trash text-danger mr-2" />Delete</b-dropdown-item
              >
            </b-dropdown>
          </template>
          <template #cell(DET_PROGRESS)="data">
            <b-progress :max="100" height="1.5rem" animated>
              <b-progress-bar
                :value="data.item.PROGRESS"
                :variant="
                  data.item.PROGRESS > 75
                    ? 'primary'
                    : data.item.PROGRESS > 50
                    ? 'warning'
                    : 'danger'
                "
                :label="`${((data.item.PROGRESS / 100) * 100).toFixed(2)}%`"
              ></b-progress-bar>
            </b-progress>
          </template>
          <template #cell(progress)="data">
            <b-progress :max="100" height="1.5rem" animated>
              <b-progress-bar
                :value="getProgress(data.item)"
                :variant="
                  getProgress(data.item) > 75
                    ? 'primary'
                    : getProgress(data.item) > 50
                    ? 'warning'
                    : 'danger'
                "
                :label="`${((getProgress(data.item) / 100) * 100).toFixed(2)}%`"
              ></b-progress-bar>
            </b-progress>
          </template>
          <template #cell(KONTRAKTOR)="data">
            {{data.item.user.NAME}}
          </template>
          <template #cell(cover)="data">
            <img
              :src="data.item.cover ? data.item.cover.PATH : ''"
              class="rounded shadow-lg"
              style="height: 50px; object-fit: cover; object-position: center"
            />
          </template>
          <template #cell(USER_COVER)="data">
            <img
              :src="data.item.user && data.item.user.cover ? data.item.user.cover.PATH : ''"
              class="rounded shadow-lg"
              style="height: 50px; object-fit: cover; object-position: center"
            />
          </template>
        </b-table>
        <div class="row">
          <div class="col">
            <div class="dataTables_paginate paging_simple_numbers float-right">
              <ul class="pagination pagination-rounded mb-0">
                <!-- pagination -->
                <b-pagination
                  v-model="currentPage"
                  :total-rows="rows"
                  :per-page="perPage"
                ></b-pagination>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <b-modal
      id="modal"
      :title="'Form ' + $props.label"
      size="lg"
      centered
      @ok="$emit('create')"
    >
      <slot name="modal">
        <p class="my-4">Hello from modal!</p>
      </slot>
    </b-modal>
    <!-- END MODAL -->
  </div>
</template>

<style>
.table > tbody > tr > td {
  vertical-align: middle;
}
</style>
