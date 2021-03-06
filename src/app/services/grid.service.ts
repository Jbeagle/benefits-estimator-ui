import { ColDef } from 'ag-grid-community'
import {
  ColumnPropToColumnInfoMap,
  ColumnTitleToColumnPropMap,
} from '../data-typing/table-value-conversion'
import { FinancialRowData } from '../data-typing/financial-row-data'

export interface ColumnDetailsService {
  getColumnDefs(): ColDef[]

  getFrameworkComponents(): any

  getColumnTitlesToProps(): ColumnTitleToColumnPropMap

  getColumnPropToColumnInfo(): ColumnPropToColumnInfoMap
}

export interface DefaultDetailsService {
  getDefaultDetails(): FinancialRowData
}
