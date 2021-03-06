
class List extends Muuri {
  constructor (container, itemGrids, listsGrid) {
    const options = {
      items: '.list-item',
      layoutDuration: 400,
      layoutEasing: 'ease',
      dragEnabled: true,
      dragSort: function () {
        return itemGrids
      },
      dragSortInterval: 0,
      dragContainer: document.body,
      dragReleaseDuration: 400,
      dragReleaseEasing: 'ease',
      dragStartPredicate: {distance: 6, delay: 0, handle: '.list-item:not(.frozen)'}
    }

    super(container, options)
    this.listsGrid = listsGrid
    this.itemGrids = itemGrids

    this.on('dragStart', function (item) {
      item.getElement().style.width = item.getWidth() + 'px'
      item.getElement().style.height = item.getHeight() + 'px'
    })
      .on('dragReleaseEnd', function (item) {
        item.getElement().style.width = ''
        item.getElement().style.height = ''
        itemGrids.forEach(function (grid) {
          grid.refreshItems()
        })
      })
      .on('layoutStart', function () {
        listsGrid.refreshItems().layout()
      })
      .on('layoutEnd', () => { // Don't bind "this"
        Item.updateIndices(this.itemGrids)
      })
  }

  static createListsGrid () {
    return new Muuri('.lists', {
      layoutDuration: 400,
      layoutEasing: 'ease',
      dragEnabled: true, // Set false to disable dragging todo-lists
      dragSort: true,
      dragSortInterval: 0,
      dragStartPredicate: {
        handle: '.list-column-header'
      },
      dragReleaseDuration: 600,
      dragReleaseEasing: 'ease'
    }).on('layoutEnd', () => {
      if (!editing) {
        setTimeout(() => {
          saveAllItems()
          showOrHideRestoreButton()
        }, 401) // Give the animation time to finish
      }
    })
  }
}
