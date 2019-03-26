"use-strict";

var Cs142TemplateProcessor = function Cs142TemplateProcessor(template){
  this.template = template;
};

Cs142TemplateProcessor.prototype.fillIn = function(dictionary){
  var regularexpression_glb = /{{[^{]*}}/g;
  var regularexpression = /{{[^{]*}}/;
  var list = this.template.match(regularexpression_glb);
  var newstr = this.template;
  console.log(list);
  for (var i = 0; i < list.length; i++){
    var last = list[i].length - 1 - 3;
    var s = list[i].substr(2, last);
    if (s in dictionary){
      newstr = newstr.replace(regularexpression, dictionary[s]);
      //newstr = newstr.replace(newstr.match(regularexpression)[0], dictionary[s]);
    }
    else {
      newstr = newstr.replace(regularexpression, '');
    }
  }
  return newstr;
};
