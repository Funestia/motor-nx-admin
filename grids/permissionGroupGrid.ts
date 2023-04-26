
import modelRepository from '../api/permissionGroup'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import {useAppStore} from "@zrm/motor-nx-core/store/app";
import {useGridData} from "@zrm/motor-nx-core/composables/grid/gridData";

export default function categoryGrid() {
  const repository = modelRepository()

  const router = useRouter()

  const toast = useToast()

  const { t } = useI18n()

  const rows = ref([])
  const meta = ref({ current_page: 1, from: 1, to: 1 })

  const handleCellEvent = async (params: {
    filterValues: any
    componentParams: any
  }) => {
    switch (params.componentParams.component) {
      case 'DeleteButton':
        // Delete the record
        await repository.delete(params.componentParams.record)
        toast.success(t('motor-admin.permissions.deleted'))
        await refreshRecords(params.filterValues)
        break
      default:
        console.log('UNHANDLED EVENT', params.componentParams)
    }
  }

  const { refreshGridData } = useGridData();

  const getGridData = async (params: any, id: string, cached: boolean = true) => {
    const {data: response } = await repository.index(params, cached);
    rows.value = response.value.data
    meta.value = response.value.meta
  }

  const refreshRecords = async (params: any = {}) => {
    const category_tree: string = router.currentRoute.value.params.categorytreeid as string
    await refreshGridData([getGridData], [getGridData], params, category_tree, true, true)
  }

  return { rows, meta, refreshRecords, handleCellEvent }
}