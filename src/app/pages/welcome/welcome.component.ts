import { CommonModule, formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzInputCkeditor } from 'src/app/third-party/ckeditor/nz-input-ckeditor';


import { DutyDateListComponent } from './duty-date-list.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-welcome',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzSelectModule,
    NzCheckboxModule,
    NzInputCkeditor,
    DutyDateListComponent,
  ],
  templateUrl: './welcome.component.html',
  styles: `
  `
})
export class WelcomeComponent implements OnInit {

  title = 'angular-forms-example';
  fg!: FormGroup;

  selectList = [{value: 'HRM', label: 'HRM'}, {value: 'HRM2', label: 'HRM2'}]

  treeList: NzTreeNodeOptions[] = [
    {
      key: 'title1',
      title: '제목1',
      isLeaf: false,
      children: [
        {
          key: 'content1',
          title: '본문1',
          isLeaf: true
        },
        {
          key: 'content1',
          title: '본문2',
          isLeaf: true
        },
      ]
    },
    {
      key: 'title2',
      title: '제목2',
      isLeaf: false,
      children: [
      ]
    }
  ];

  constructor(private fb: FormBuilder) {
    this.fg = this.fb.group({
      input_text: ['test', [ Validators.required ]],
      input_textarea: ['text area', [ Validators.required ]],
      input_date: [formatDate(new Date(),'YYYY-MM-ddTHH:mm:ss.SSS','ko-kr'), [ Validators.required ]],
      input_number: [1, [ Validators.required ]],
      input_select: [null, [ Validators.required ]],
      input_treeselect: [null, [ Validators.required ]],
      input_deptselect: [null, [ Validators.required ]],
      input_color: [null]
    });
  }

  ngOnInit() {
  }

  custom_label(option: any, i: number): any {
    return option.label + ' ' + i;
  }

}
