import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Output() termEvent = new EventEmitter<string>();
  @ViewChild('inputSearch') inputSearch!: ElementRef;

  public searched: boolean = false;

  public search(event: any) {
    this.searched = true;
    this.termEvent.emit(event.target.value);
  }

  public clickSearch() {
    if (this.inputSearch.nativeElement?.value) {
      this.searched = true;
      let searchText = this.inputSearch.nativeElement?.value.trim();
      this.termEvent.emit(searchText);
    }
  }

  public onChange() {
    if (this.searched && this.inputSearch.nativeElement?.value.trim() === '') {
      this.clearSearch();
    }
  }

  public onClick() {
    if (this.searched && this.inputSearch.nativeElement?.value.trim() === '') {
      this.clearSearch();
    }
  }

  public clearSearch() {
    this.searched = false;
    this.inputSearch.nativeElement.value = '';
    this.termEvent.emit('');
  }
  
}
