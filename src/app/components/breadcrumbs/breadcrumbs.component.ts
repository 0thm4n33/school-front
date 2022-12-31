import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.css']
})
export class BreadcrumbsComponent implements OnInit {

  @Input() espace: string = "";
  @Input() page: string = "";

  constructor() { }

  ngOnInit(): void {
  }

}
