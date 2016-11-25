import $ from 'jquery';
import { bindAll } from 'lodash';

// const ACCEPTABLE_TAGS = ["a", "p", "li", "h1", "h2", "h3", "h4", "h5", "span"].join(", ");

class Annotator {
  constructor(){
    this.annotations = [];
    this.$bubble = $("<div id='annotaion-bubble'>");
    this.$bubbleContent = $("<div id='bubble-content'>");
    this.$bubbleImage = $("<img>");

    bindAll(this, "hideBlurb");

    this.$bubble.append(this.$bubbleImage);
    this.$bubble.append(this.$bubbleContent);
    $(document.body).click(this.hideBlurb);
  }

  add({annotations, imageUrl}){
    this.$bubbleImage.attr("src", imageUrl);
    annotations.forEach( annotation => {
      this._addAnnotation(annotation);
    });
  }

  _addAnnotation(annotation){
    let $nodes = $(`:contains(${annotation.ref_text})`).filter("p");
    $nodes.each( (_, node) => this._addToNode(annotation, $(node)));
  }

  _addToNode(annotation, $node){
    const html = $node.html().replace(
      annotation.ref_text,
      "<span class='highlite-lens'>" + annotation.ref_text + "</span>"
    );
    $node.html(html);
    const $highlite = $node.find(".highlite-lens");
    $highlite.click(function(event){
      event.preventDefault();
      event.stopPropagation();
      this.$bubbleContent.html(annotation.comment);
      $highlite.append(this.$bubble);
      this.$bubble.show(300);
    }.bind(this));
  }

  // Hides all blurbs
  hideBlurb(){
    this.$bubble.hide(100);
  }

  drop(){
    $('.highlite-lens').contents().unwrap();
  }



}

export default Annotator;
