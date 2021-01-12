import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';

import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, AfterViewChecked {

  key: string;
  azvalue: string;
  ruvalue: string;
  envalue: string;
  parsingKey = {
    first: '',
    second: ''
  };
  valid = false;
  keyRows = [];
  copy = [];
  editingKey = '';
  editingItem: any = {
    azvalue: '',
    ruvalue: '',
    envalue: '',
    key: {
      first: '',
      second: ''
    }
  };
  addClick = false;

  constructor(
    private firesServices: AngularFirestore,
    private dataBase: AngularFireDatabase,
    private changeRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.list();
  }

  ngAfterViewChecked(): void {
    this.changeRef.detectChanges();
  }

  add(form): boolean {
    console.log(form.valid);
    console.log(form);
    this.addClick = true;

    return false;
    const arr = this.key.split('.');
    this.parsingKey.first = arr[0];
    this.parsingKey.second = arr[1];
    this.dataBase.object('keys/az/' + this.parsingKey.first).update({[this.parsingKey.second]: this.azvalue})
      .then(_ => this.azvalue = this.key = '')
      .catch(err => console.log(err, 'You dont have access!'));
    this.dataBase.object('keys/ru/' + this.parsingKey.first).update({[this.parsingKey.second]: this.ruvalue})
      .then(_ => this.ruvalue = '')
      .catch(err => console.log(err, 'You dont have access!'));
    this.dataBase.object('keys/en/' + this.parsingKey.first).update({[this.parsingKey.second]: this.envalue})
      .then(_ => this.envalue = '')
      .catch(err => console.log(err, 'You dont have access!'));
  }

  list(): void {
    this.dataBase.list('keys').valueChanges()
      .subscribe(actions => {
        const arr = actions;
        this.keyRows = [...arr];
      });
  }

  checkDisabled(firstKey, secondKey): boolean {
    return !(this.editingKey === firstKey + secondKey);
  }

  edit(firstKey, secondKey): void {
    this.list();
    this.editingKey = firstKey + secondKey;
  }

  setNew(eventAZ, eventEn, eventRU, firstKey, secondKey): boolean {
    if (eventAZ.length === 0 || eventEn.length === 0 || eventRU.length === 0) {
      // todo исправить эту ошибку__ не правильно копируестя массив
      console.log(this.keyRows);
      console.log(this.copy);
      this.list();
      return false;
    }
    this.dataBase.object('keys/az/' + firstKey).update({[secondKey]: eventAZ})
      .then(_ => this.envalue = '')
      .catch(err => console.log(err, 'You dont have access!'));

    this.dataBase.object('keys/ru/' + firstKey).update({[secondKey]: eventRU})
      .then(_ => this.envalue = '')
      .catch(err => console.log(err, 'You dont have access!'));

    this.dataBase.object('keys/en/' + firstKey).update({[secondKey]: eventEn})
      .then(_ => this.envalue = '')
      .catch(err => console.log(err, 'You dont have access!'));
    this.editingKey = '';
  }

  copyFirst(): void {
    if (this.azvalue) {
      this.envalue = this.ruvalue = this.azvalue;
      // this.add();
    }
  }
}


