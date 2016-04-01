'use strict';

var database = new Firebase('https://buwmu8r5chg.firebaseio-demo.com/');

$(document).ready(function () {
    var note_buttons = $('#note_table_body');
    var note_title      = $('#note_title_text');
    var add_note_button = $('#add_note_btn');

    
    
    $('.tooltipped').tooltip({ delay : 40});
    note_title.attr('data-tooltip', note_title.html());
    
    database.on('child_added', function(snapshot) {
        var note = snapshot.val();
        arrangeNotes.newNote(snapshot.key(), note.title, note.content, note.status);
    });
    
    database.on('child_removed', function (snapshot) {
        arrangeNotes.removeNote(snapshot.key());
    });
    
    add_note_button.click(function () {
        addNote.construct($('body'));
    });
    
});

$(document).on('click','button.note_entries', function () {
    var note_title  = $('#note_title_text');
    var note_content = $('#note_content_text');
    var focusNote= $($(this).html());
    
    note_title.html( focusNote.html() );
    note_title.attr('data-tooltip', note_title.html());
    note_content.html(focusNote.attr('value'));
});

$(document).on('click','button.note_done', function () {
    var id = ($(this).attr('id')).slice(5);
    var old_status = $(this).val();
    var to_done = database.child(id);
    var new_status =  (parseInt(old_status) + 1) % 2;
    if(new_status===1){
        $(this).attr('class','waves-effect waves-light green lighten-1 btn col s1.5 note_done');
        $(this).attr('value',1);
    }
    else {
        $(this).attr('class','waves-effect waves-light grey darken-2 btn col s1.5 note_done');
        $(this).attr('value',0);
    }
    //to_done.set({status : new_status});
    to_done.update({status : new_status}); 
    
});

var addNote = {
    construct: function (target_area) {
        target_area.append([
            '<div id="note_form_modal" class="modal">',
                '<div>',
                    '<form id="note_form">',
                        '<div class="modal-content">',
                            '<h3>Add A New Note</h3>',
                            '<input id="note_form_title" type="text" placeholder="Title" required="true" value="">',
                            '<textarea id="note_form_content" class="materialize-textarea" required="true" value=""></textarea>',
                        '</div>',
                        '<div class="modal-footer">',
                            '<input type="submit" value="Done" id="note_form_submit" class="btn-flat green-text waves-effect right"/>',
                        '</div>',
                    '</form>',
                '</div>',
            '</div>'
        ].join(''));
        
        $('.modal-trigger').leanModal();
        
        $('#note_form_submit').click(function () {
            var time = Date();
            var n_title = $('#note_form_title').val();
            var n_content = $('#note_form_content').val();
            
            var empty = (n_title==='' || n_content==='');
            if (empty) {
                    return;
            }
            database.push({
                title: n_title,
                content: n_content,
                status: 0,
                date: time
            }, function (error) {
                if (error) {
                    return Materialize.toast('Error in pushing new value!', 4000);
                }
                else {
                    return Materialize.toast('Successfully added NOTE:' + n_title, 4000);
                }
            });
            
            $('#note_form_title').val('');
            $('#note_form_content').val('');
            $('#note_form_modal').closeModal();
            
            return false;
        });
    }
};

var arrangeNotes = {
    
    newNote : function(id, title, content, status){
        var note_buttons = $('#note_table_body');
        var btn_bg = 'grey darken-2';
        
        if(status===1) btn_bg = 'green lighten-1';
        
        note_buttons.append([
            '<tr id="note_cell_'+id+'">'+'</tr>'
        ]);
        $('#note_cell_'+id).html(
            '<button id="note'+id+'" class="waves-effect waves-light btn-flat white-text col s8 note_entries">'+
                '<h6 id="note_'+id+'_title" class="truncate" value="'+content+'">'+
                    ''+title+''+
                 '</h6>'+
            '</button>'+
            '<button id="done_'+id+'" class="waves-effect waves-light '+btn_bg+' btn col s1.5 note_done" value="'+status+'">'+
                '<i class="small material-icons">'+
                    'check'+
                '</i>'+
            '</button>'+
            '<button id="remove_note_'+id+'"class="waves-effect waves-light green darken-2 btn col s1.5">'+
                '<i class="small material-icons">'+
                    'remove'+
                '</i>'+
            '</button>'
        );
        
        
        $('#remove_note_'+id).click(function () {
            database.child(id).remove(function (error) {
                if (error) { 
                    Materialize.toast("Error in removing a note!",2000);
                    return;
                }
                else {
                    Materialize.toast("Successfully removed note: "+title,2000);
                    return;
                }
            });
            
            arrangeNotes.removeNote(id);
        });
    },
    
    removeNote : function(id){
        $('#note_cell_'+id).remove();
    }
};
