$(function(){

  let lensList = [];
  let lensHash = {};
  let searchParam = "";
  const $form = $("#lens-form");
  const $lensContainer = $("#lens-container");
  const $search = $("#search input");
  const $summary = $("#summary");

  // Step 1 - retrieve list of saved lenses from local storage
  chrome.storage.local.get("lensList", function(data){
    fetchLenses();
    if (data.lensList){
      lensList = data.lensList;
    }
  });

  // Step 2 - fetch list of lenses
  function fetchLenses(){
    $.get('http://localhost:3000/lenses', addLenses);
  }

  // Step 3 - add the lenses
  function addLenses(lenses){
    lenses.forEach( function(lens){
      lensHash[lens.id] = lens;
    });
    renderSearch();
    renderLenses();
  }

  // Step 4 - render the list
  function renderLenses(){
    $form.empty();
    lensList.forEach(function(lensId){
      const lens = lensHash[lensId];
      if (!lensHash[lensId]){ return ;}
      const newLabel = $(`<label><input type="radio" name="lens" data-lens-id="${lensId}" /> ${lens.name}</label>`);
      $form.append(newLabel);
    });
  }

  function renderSearch(){
    $lensContainer.empty();
    for ( let lensId in lensHash ){
      if (lensHash[lensId].name.toLowerCase().includes(searchParam)){
        renderSearchItem(lensHash[lensId]);
      }
    }
  }

  function renderSearchItem(lens){
    const newLens = $("<div class='lens'>");
    newLens.html(lens.name);
    newLens.attr("data-lens-id", lens.id);
    $lensContainer.append(newLens);
    newLens.click(function(){
      if (lensList.includes(lens.id)){
        const idx = lensList.findIndex(el => el === lens.id);
        lensList.splice(idx, 1);
        renderLenses();
      } else {
        lensList.push(lens.id);
        renderLenses();
      }
      saveLenses();
    });
  }

  // Step 5 - Save the list
  function saveLenses(){
    chrome.storage.local.set({lensList: lensList});
  }


  // Add change handler to lens list form
  $form.on("change", function(e){
    const lensId = e.target.dataset.lensId;

    const detail = {detail: { lensId: lensId }};

    const toInject =
    `var event = new CustomEvent(
      'fetchAnnotations',
      {detail: { lensId: ${lensId} }}
    );
    document.dispatchEvent(event);`;

    chrome.tabs.executeScript({code: toInject});
  });

  // Add change handler to the search bar
  $search.on("input", function(event){
    searchParam = $search.val();
    renderSearch();
  });

  // Add click handler to summary button
  $summary.click(function(){
    const toInject =
    `var event = new CustomEvent('fetchSummary');
    document.dispatchEvent(event);`;

    chrome.tabs.executeScript({code: toInject});
  });

});
