/*jshint indent:2, curly:true eqeqeq:true, immed:true, latedef:true,
newcap:true, noarg:true, regexp:true, undef:true, trailing:true
white:true*/
/*global enyo:true, XT:true, XV:true */

(function () {
  enyo.kind({
    name: "XV.RepeaterBox",
    kind: "XV.WorkspaceBox",
    published: {
      columns: [],
      collection: null,
      recordType: null
    },
    handlers: {
      onDeleteRow: "deleteRow"
    },
    classes: "xv-repeater-box xv-groupbox",
    components: [
      { kind: "onyx.GroupboxHeader", classes: "xv-repeater-box-header", name: "title", content: "Title" },
      { kind: "onyx.Groupbox", classes: "onyx-toolbar-inline", name: "headerRow" },
      { kind: "enyo.Scroller", components: [ // XXX this doesn't work
        { kind: "Repeater", name: "repeater", count: 0, onSetupItem: "setupRow", components: [
          { kind: "XV.RepeaterBoxRow", name: "repeaterRow" }
        ]},
        { kind: "onyx.Button", name: "newRowButton", onclick: "newRow", content: "Add New" }
      ]}
    ],
    create: function () {
      this.inherited(arguments);
      this.$.title.setContent(this.name);

      /**
       * If the columns are defined from the outset of the creation of this class
       * then we should render the labels now because columnsChanged will never be
       * called.
       */
      if (this.getColumns()) {
        this.showLabels();
      }
    },
    columnsChanged: function () {
      this.showLabels();
    },
    showLabels: function () {
      // XXX probably should clear all existing so as not to ever double up
      for (var iColumn = 0; iColumn < this.getColumns().length; iColumn++) {
        var columnDesc = this.getColumns()[iColumn];
        var label = ("_" + XT.String.suffix(columnDesc.name)).loc();

        this.createComponent({
          container: this.$.headerRow,
          content: label,
          classes: "xv-label"
        });
      }
    },
    newRow: function () {
      var modelType = XT.String.suffix(this.getRecordType());
      var newModel = new XM[modelType](null, { isNew: true });
      this.getCollection().add(newModel);
      this.$.repeater.setCount(this.getCollection().size());
    },
    setupRow: function (inSender, inEvent) {
      var row = inEvent.item.$.repeaterRow;
      row.setColumns(this.getColumns());
      var model = this.getCollection().at(inEvent.index);
      row.setModel(model);
      if (model.getStatus() & XM.Model.DESTROYED) {
        row.setDisabled(true);
      }
    },
    setValue: function (value, options) {
      this.setCollection(value);

      // XXX: This should get called in collectionChanged, but it doesn't work there
      this.$.repeater.setCount(this.getCollection().size());
    },
    /**
     * Display the collection in the grid when it's passed in.
     */
    collectionChanged: function () {
      // XXX this should get called here but some bug is keeping setupRow from being called
      //this.$.repeater.setCount(this.getCollection().size());
    },
    deleteRow: function (inSender, inEvent) {
      inEvent.originator.parent.getModel().destroy();
      this.$.repeater.setCount(this.getCollection().size());
    }
  });
}());
