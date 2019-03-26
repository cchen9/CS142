'use strict';

class TableTemplate {
    static getTable(id){
      return document.getElementById(id);
    }

    static getRows(tbl){
      return tbl.rows;
    }

    static getNumRows(tbl){
      return tbl.rows.length;
    }

    static getNumColumns(tbl){
      return tbl.rows[0].cells.length;
    }

    static getHdr(tbl){
      return tbl.rows[0];
    }

    static filterHdr(tbl, hdr){
      // innerHTML has tags
      return (new Cs142TemplateProcessor(hdr.innerHTML));
    }

    static fillIn(id, dict, columnName) {
        this.getHdr(this.getTable(id)).innerHTML = this.filterHdr(this.getTable(id), this.getHdr(this.getTable(id))).fillIn(dict);

        var columns2filter = [];
        // GO OVER THE FIRST ROW OF THE TABLE TO SEE WHICH COLUMNS TO FILTER:
        for (var x = 0; x < this.getNumColumns(this.getTable(id)); x++){
          if (columnName === undefined || this.getHdr(this.getTable(id)).cells[x].innerHTML === columnName){
            columns2filter.push(x);
          }
        }
        // STARTING FROM THE SECOND ROW OF THE TABLE, FILTER THE CONTENTS
        for (var x_ = 1; x_ < this.getNumRows(this.getTable(id)); x_++){
          for (var y = 0; y < columns2filter.length; y++){
            var f_ = new Cs142TemplateProcessor(this.getTable(id).rows[x_].cells[columns2filter[y]].innerHTML);
            this.getTable(id).rows[x_].cells[columns2filter[y]].innerHTML = f_.fillIn(dict);
          }
        }
        if (this.getTable(id).style.visibility === 'hidden') {
            this.getTable(id).style.visibility = 'visible';
        }
    }
}
