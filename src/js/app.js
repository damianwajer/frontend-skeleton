import $ from "jquery";
import "popper.js";
import "bootstrap";
import {Person} from "./modules/Person";

const app = {
  initJs: function () {
    $("html")
      .removeClass("no-js")
      .addClass("js");
  },
  initPerson: function () {
    const john = new Person("John", "Smith");
    console.log(john.fullName);
  }
};

$(document).ready(function () {
  app.initJs();
  app.initPerson();
});

$(window).on("load", function () {

});

$(window).on("resize", function () {

});

$(window).on("scroll", function () {

});
