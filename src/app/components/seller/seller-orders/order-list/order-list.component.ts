import { Component, OnInit} from '@angular/core';
import { getLoggedInUser } from "src/app/helpers/userUtility";
import { OrderService } from "../../../../services/order/order.service";
import { OrderDetail } from "../../../../models/order.model";
import { UserService } from './../../../../services/user/user.service';
import { fullInvoiceStatus } from './../../../../models/invoice.model';
import { formatDate } from './../../../../helpers/date-format';
import { numberWithCommas } from './../../../../helpers/number-format';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  numberWithCommas:Function = numberWithCommas
  status:string;
  user = getLoggedInUser();
  public orderList:OrderDetail[]; 
  pageNumber: number;
  totalItemCount: number;
  maximumItem: number = 8;
  defaultPage:number = 1;

  filterType = fullInvoiceStatus;
  formatDate:Function;

  constructor(public orderService:OrderService,public userService:UserService) {
    this.formatDate = formatDate;
  }

  ngOnInit(): void {
    this.status = this.filterType.Paid;
    this.fetchCurrentOrders(this.defaultPage);
  }

  filter(status:string):void{
    this.status = status;
    this.fetchCurrentOrders(this.defaultPage);
  }

  fetchCurrentOrders(pageNumber:number){
    this.orderService.getOrdersByStatus(this.user.id,this.status,pageNumber,this.maximumItem)
      .subscribe((o)=>{
        let oList:OrderDetail[] = o.data.data
        this.orderList = oList.map((oi)=>{
          oi.user$ = this.userService.getUserById(oi.userId)
          return oi
        });
        this.pageNumber = o.data.pager.pageNumber;
        this.totalItemCount = o.data.pager.totalItemCount;
      },error => console.error(error));
  }
}
