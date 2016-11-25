import $ from 'jquery';
import Annotator from './annotator';
import SummaryModal from './summary_modal';

$(function(){
  const annotator = new Annotator();
  const summary = new SummaryModal();

  $(document).on('fetchAnnotations', function(e) {
    const loc = window.location;
    const url = loc.hostname + loc.pathname;
    var x = e.detail.lensId;

    $.ajax({
      method: "GET",
      url: `http://localhost:3000/lenses/${e.detail.lensId}/annotations`,
      data: {url},
      success(data){
        annotator.drop();
        annotator.add(data);
      },
      error(){
        console.log("error with annotator :(");
      }
    });
  });


  $(document).on('fetchSummary', function() {
    const loc = window.location;
    const url = loc.hostname + loc.pathname;

    $.ajax({
      method: "GET",
      url: 'http://localhost:3000/articles/summary',
      data: {url},
      success(data){
        summary.add(data);
      },
      error(){
        console.log("error with summary :(");
      }
    });
  });

});
