import $ from 'jquery';

class SummaryModal{
  constructor(){
    this.$overlay = $("<div id='lens-overlay'>");
    this.$modal = $("<div id='lens-modal'>");
    $(document.body).append(this.$overlay);
    $(document.body).append(this.$modal);
    this.$overlay.click(this.close.bind(this));
  }

  open(){
    this.$overlay.fadeIn(300);
    this.$modal.fadeIn(300);
  }

  close(){
    this.$overlay.fadeOut(100);
    this.$modal.fadeOut(100);
  }

  add(data){
    this.$modal.empty();
    for (let lensId in data){
      this.addLens(data[lensId]);
    }
    this.open();
  }

  addLens(lens){
    const $div = $(`
      <div>
        <img src=${lens.image_url} />
        <h2>${lens.name}</h2>
        <ul class="summary-items"></ul>
      </div>
    `);

    const $itemsContainer = $div.find('.summary-items');
    lens.annotations.forEach( annotation => {
      const $li = $(`<li>${annotation.comment}</li>`);
      $itemsContainer.append($li);
    });

    this.$modal.append($div);
  }
}

export default SummaryModal;
