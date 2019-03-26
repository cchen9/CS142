"use strict";

function DatePicker(div_id, callback){
  this.div_id = div_id;
  this.callback = callback;
  this.prt = document.getElementById(this.div_id);
  this.months = ["January", "February","March", "April","May", "June", "July", "August", "September",
  "October","November","December"];
  this.daysList = ["Su", "Mo","Tu","We","Th","Fr","Sa"];

}

DatePicker.prototype.makeTable = function(){
  return document.createElement("TABLE");
};

DatePicker.prototype.makeTitleBar = function(grid){
  return grid.createTHead();
};

DatePicker.prototype.makeTableRow = function(title_bar, row_index){
  return title_bar.insertRow(row_index);
};

DatePicker.prototype.makeRowBlock = function(row, block_index, label, colspan){
  var BackArrow = row.insertCell(block_index);
  BackArrow.textContent = label;
  BackArrow.colSpan=colspan;
  return BackArrow;
};

DatePicker.prototype.addEventListBackward = function(BackArrow, grid, date, prev_month, pp){
  BackArrow.onclick = function() {
    grid.remove();
    date.setMonth(prev_month);
    pp.render(date);
  };
};

DatePicker.prototype.addEventListForward = function(ForwardArrow, grid, date, next_month, pp){
  ForwardArrow.onclick = function() {
    grid.remove();
    date.setMonth(next_month);
    pp.render(date);
  };
};

DatePicker.prototype.addBlockEHandler = function(iterDay, block, pp){
  var next_month = iterDay.getMonth() + 1;
  var FixedDate = {
      month: next_month,
      day: block.textContent,
      year: iterDay.getFullYear()
  };
  block.onclick = function() {
    pp.callback(pp.div_id, FixedDate);
  }
};

DatePicker.prototype.getFirstDay = function(curr_month, curr_yr){
  var FIRST = 1;
  return (new Date(curr_yr, curr_month, FIRST));
};

DatePicker.prototype.render = function(date){
  var grid = this.makeTable();
  var title_bar = this.makeTitleBar(grid);
  var RowZero = this.makeTableRow(title_bar, 0);
  var curr_month = date.getMonth();
  var curr_yr = date.getFullYear();
  var BackArrow = this.makeRowBlock(RowZero, 0, "<<--", "1");
  var MonthSlot = this.makeRowBlock(RowZero, 1, this.months[curr_month] + "   " + curr_yr, "5");
  var ForwardArrow = this.makeRowBlock(RowZero, 2, "-->>", "1");
  var pp = this;
  this.addEventListBackward(BackArrow, grid, date, curr_month - 1, pp);
  this.addEventListForward(ForwardArrow, grid, date, curr_month + 1, pp);
  var firstDay = this.getFirstDay(curr_month, curr_yr);
  var iterDay = this.getFirstDay(curr_month, curr_yr);

  var DayNameRows = this.makeTableRow(title_bar, 1);
  for (var i = 0; i < this.daysList.length; ++i) {
      this.makeRowBlock(DayNameRows, i, this.daysList[i], "1");
  }
  iterDay.setDate(firstDay.getDate() - firstDay.getDay());
  var row_ind = 1;
  var started = false;
  while (!started || (iterDay.getMonth() === curr_month)) {
      started = true;
      row_ind += 1;
      var weekrow = this.makeTableRow(grid, row_ind);
      for ( i = 0; i < this.daysList.length; ++ i) {
          var bloc = this.makeRowBlock(weekrow, i, iterDay.getDate(), "1");
          if (iterDay.getMonth() !== curr_month){
            bloc.id = "dimmed_block";
          }
          else{
            this.addBlockEHandler(iterDay, bloc, pp);
          }
          var next_date = iterDay.getDate() + 1;
          iterDay.setDate(next_date);
      }
  }
  this.prt.appendChild(grid);
};
