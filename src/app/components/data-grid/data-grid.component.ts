import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core'
import { SimpleGridService } from '../../services/simple-grid.service'
import { DiscountANameCalculationService } from '../../services/discount-a-name-calculation.service'
import { ColDef, GridApi } from 'ag-grid-community'
import { FinancialRowData } from '../../data-typing/financial-row-data'
import { GridService } from '../../services/grid.service'
import { CalculationService } from '../../services/calculation.service'

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridComponent {
  domLayout = 'autoHeight'
  annualCostToCompany: number
  gridApi: GridApi
  frameworkComponents
  columnDefs: ColDef[]
  rowData: FinancialRowData[] = [this.gridService.getDefaultDetails()]

  constructor(
    private cd: ChangeDetectorRef,
    @Inject('GridService') private gridService: GridService,
    @Inject('CalculationService') private calcService: CalculationService,
  ) {
    this.columnDefs = gridService.getColumnDefs()
    /* Add the click handler for the remove row column */
    this.columnDefs[0].cellRendererParams = {
      clicked: () => {
        this.onCellValueChanged()
      },
    }
    this.frameworkComponents = this.gridService.getFrameworkComponents()
  }

  onGridReady(params): void {
    this.gridApi = params.api
  }

  getCurrentRowData(): any {
    const currentRowData: FinancialRowData[] = []
    if (!this.gridApi) {
      return currentRowData
    }
    this.gridApi.forEachNode((rowNode, index) => {
      currentRowData.push(rowNode.data)
    })
    return currentRowData
  }

  recalculateAnnualCost(currentRows: FinancialRowData[]): void {
    this.annualCostToCompany = this.calcService.getAnnualCompanyCost(
      currentRows,
    )
    /* Ensure that Angular's change detection picks up the update */
    this.cd.markForCheck()
  }

  onCellValueChanged(): void {
    const currentRows: FinancialRowData[] = this.getCurrentRowData()
    if (currentRows.length > 150) {
      /* Ensures the grid is using lazy loading if there are more than 150 rows */
      this.domLayout = ''
    }
    /* Any time a cell is changed, recalculate the total cost to the company */
    this.recalculateAnnualCost(currentRows)
  }

  addEmployee(): void {
    const updatedRowData: FinancialRowData[] = this.getCurrentRowData()
    updatedRowData.push(this.gridService.getDefaultDetails())
    this.rowData = updatedRowData
    this.annualCostToCompany = null
  }

  importData(importedData: FinancialRowData[]): void {
    this.rowData = importedData
    this.gridApi.setRowData(this.rowData)
    /* Manually trigger recalculating the total cost*/
    this.recalculateAnnualCost(importedData)
  }
}
