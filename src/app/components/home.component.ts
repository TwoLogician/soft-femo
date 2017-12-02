import { Component } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

import { FoodInfo, ShopInfo } from "./../shared/models";

@Component({
    templateUrl: "./home.component.html"
})
export class HomeComponent {

    food = new FoodInfo();
    foodRef: AngularFireList<FoodInfo>;
    foods: FoodInfo[] = [];
    keyword = "";
    rejected = reason => {
        alert(reason);
        console.log(reason);
    }
    shop = new ShopInfo();
    shopRef: AngularFireList<ShopInfo>;
    shops: ShopInfo[] = [];

    constructor(db: AngularFireDatabase, public afAuth: AngularFireAuth) {
        this.foodRef = db.list(`food/${afAuth.auth.currentUser.uid}`);
        this.foodRef.snapshotChanges().forEach(x => {
            this.foods = [];
            x.forEach(y => {
                let food = new FoodInfo();
                let val  = y.payload.val();
                food["key"] = y.payload.key;
                food.good = val.good;
                food.name = val.name;
                food.note = val.note;
                food.shopKey = val.shopKey;
                this.foods.push(food);
            });
        });
        this.shopRef = db.list(`shop/${afAuth.auth.currentUser.uid}`);
        this.shopRef.snapshotChanges().forEach(x => {
            this.shops = [];
            x.forEach(y => {
                let shop = new ShopInfo();
                shop["key"] = y.payload.key;
                shop.name = y.payload.val().name;
                this.shops.push(shop);
            });
        });
    }

    deleteEverything() {
        this.shopRef.remove();
    }

    deleteFood(item: FoodInfo) {
        this.foodRef.remove(item["key"]);
    }

    deleteShop(item: ShopInfo) {
        this.shopRef.remove(item["key"]);
    }

    getFoods(): FoodInfo[] {
        let keyword = this.keyword.toUpperCase();
        return this.foods.filter(x => x.name.toUpperCase().includes(keyword) || x.note.toUpperCase().includes(keyword) || this.getShopName(x.shopKey).toUpperCase().includes(keyword));
    }

    getShopName(key): string {
        let shop = this.shops.find(x => x["key"] == key);
        if (shop) {
            return shop.name;
        }
        return "";
    }

    initFood(item: FoodInfo) {
        this.food = item;
    }

    initShop(item: ShopInfo) {
        this.shop = item;
    }

    saveFood() {
        let fulfilled = value => this.initFood(new FoodInfo());
        let key = this.food["key"];
        if (key) {
            this.foodRef.update(key, this.food).then(value => {
                fulfilled(value);
            }, reason => {
                this.rejected(reason);
            });
        }
        else {
            this.foodRef.push(this.food).then(value => {
                fulfilled(value);
            }, reason => {
                this.rejected(reason);
            });
        }
    }

    saveShop() {
        let fulfilled = value => this.initShop(new ShopInfo());
        let key = this.shop["key"];

        if (key) {
            this.shopRef.update(key, this.shop).then(value => {
                fulfilled(value);
            }, reason => {
                this.rejected(reason);
            });
        }
        else {
            this.shopRef.push(this.shop).then(value => {
                fulfilled(value);
            }, reason => {
                this.rejected(reason);
            });
        }
    }
}