import { Component, OnInit } from "@angular/core";
import { RadioOption } from "app/shared/radio/radio-option.model";
import { OrderService } from "./order.service";
import { CartItem } from "app/restaurant-detail/shopping-cart/cart-item.model";
import { Order, OrderItem } from "./order.model";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "mt-order",
  templateUrl: "./order.component.html",
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup;
  emailPattern =
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  numberPattern = /^[0-9]*$/;

  paymentOptions: RadioOption[] = [
    { label: "Dinheiro", value: "MON" },
    { label: "Cartão de Débito", value: "DEB" },
    { label: "Cartão Refeição", value: "REF" },
  ];

  constructor(
    private orderService: OrderService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.orderForm = this.formBuilder.group({
      name: this.formBuilder.control("", [
        Validators.required,
        Validators.minLength(5),
      ]),
      email: this.formBuilder.control("", [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      emailConfirmation: this.formBuilder.control("", [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      address: this.formBuilder.control("", [
        Validators.required,
        Validators.minLength(5),
      ]),
      number: this.formBuilder.control("", [
        Validators.required,
        Validators.pattern(this.numberPattern),
      ]),
      optionalAddress: this.formBuilder.control(""),
      paymentOption: this.formBuilder.control("", [Validators.required]),
    });
  }
  delivery: number = 8;

  itemsValue(): number {
    return this.orderService.itemsValue();
  }

  cartItems(): CartItem[] {
    return this.orderService.cartItems();
  }

  increaseQty(item: CartItem) {
    this.orderService.increaseQty(item);
  }
  decreaseQty(item: CartItem) {
    this.orderService.decreaseQty(item);
  }

  remove(item: CartItem) {
    this.orderService.remove(item);
  }

  checkOrder(order: Order) {
    order.orderItems = this.cartItems().map(
      (item: CartItem) => new OrderItem(item.quantity, item.menuItem.id)
    );

    this.orderService.checkOrder(order).subscribe((orderId: string) => {
      this.router.navigate(["/order-summary"]);
      console.log(`COmpra concluida: ${orderId}`);
      this.orderService.clear();
    });
  }
}
