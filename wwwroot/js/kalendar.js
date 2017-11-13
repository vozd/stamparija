var active_monat = 0;
var constants = {
    'canvas_width': '600',
    'canvas_height': '420',
    'canvas_image_height': '360'
};

$(document).load(function() {
    $('#spinner').show();
});


$(document).ready(function() {
    $("#tabs").tabs({
        activate: function(event, ui) {
            active_monat = ui.newPanel.data('monat');
        }
    });
    //disabling buttons
    $('.accept').prop('disabled', true);
    $('.rotation').prop('disabled', true);
    $('#btnUpload').prop('disabled', true);
    $('.dragan').prop('disabled', true);


    //spining the picture for 90 degree




    var canvas_counter = 0;
    //get involved variables first
    var canvas = $('#canvas' + active_monat)[0];
    var context = canvas.getContext('2d');





    // draw kalender cower template on canvas at first page
    if (!canvas.hasAttribute('title')) {
        insertMounths(active_monat);
        if (active_monat == 0) {
            $(".div44").css("height", "420px");
        }
    }


    // draw kalender  template on canvas on tab change
    $('#tabs ul li').click(function() {

        if (active_monat === 0) {
            $(".div44").css("height", "420px");
        } else {
            $(".div44").css("height", "360px");
        }

        insertMounths(active_monat);
    });

    $('.FileUpload').change(function() {
        //get involved variables first
        var canvas = $('#canvas' + active_monat)[0];
        var context = canvas.getContext('2d');
        var resize_image = $(this).parent().parent().parent().parent().find('.resize-image');
        var resize_image_div = $(this).parent().parent().parent().parent().find('.cont-resize-image');

        //show container div and accept button
        $(this).parent().parent().parent().parent().find('.div44').show();
        $(this).parent().parent().find('.accept').prop('disabled', false);

        //draw kalender template on canvas
        var imgCanvas = new Image();
        imgCanvas.src = '../images/Kalendar' + active_monat + '.jpg';
        imgCanvas.onload = function() {

            canvas.height = this.height;
            canvas.width = this.width;

            context.drawImage(imgCanvas, 0, 0);

            $('#canvas' + active_monat).css({ 'width': constants.canvas_width, 'height': constants.canvas_height });

            imgCanvas = null;

        };

        // prepare HTML5 FileReader
        var reader = new FileReader();
        reader.onload = function(evt) {
            if (evt.target.readyState == FileReader.DONE) {

                var oImage = new Image();
                oImage.src = evt.target.result;
                oImage.onload = function() { // onload event handler
                    resize_image.attr('src', evt.target.result);
                    resize_image.data('width', this.width);
                    resize_image.data('height', this.height);



                    var image_height = this.height;
                    var image_width = this.width;

                    //remove instances of used plugins
                    var b = resize_image.resizable("instance");
                    if (typeof b != "undefined") { resize_image.resizable("destroy"); };
                    b = resize_image.draggable("instance");
                    if (typeof b != "undefined") { resize_image.draggable("destroy"); };

                    resize_image.removeClass("height");
                    resize_image.removeClass("width");

                    //position image on canvas based on height
                    resize_image.css("height", constants.canvas_image_height + "px");
                    var a = image_width / image_height * constants.canvas_image_height;
                    resize_image.css("width", a + "px");



                    var ImageAspectRation = image_width / image_height;

                    resize_image.data('KoefImg', image_height / constants.canvas_image_height);
                    resize_image.data('xPosCSS', 0);
                    resize_image.data('yPosCSS', 0);

                    resize_image.resizable({
                        aspectRatio: ImageAspectRation,
                        start: function(event, ui) {},
                        stop: function(event, ui) {
                            resize_image.data('KoefImg', image_height / ui.size.height);
                        }
                    });
                    resize_image_div.draggable({
                        start: function(event, ui) {
                            isDraggingMedia = true;
                        },
                        stop: function(event, ui) {
                            isDraggingMedia = false;
                        },
                        drag: function() {
                            var position = $(this).position();
                            resize_image.data('xPosCSS', position.left);
                            resize_image.data('yPosCSS', position.top);
                        }
                    });
                    $('#spinner').hide();

                }
            }
        }
        $('#spinner').show();
        reader.readAsDataURL($(this)[0].files[0]);
        $('.rotation').prop('disabled', false);

    });

    $(".accept").click(function() {
        var canvas = $('#canvas' + active_monat)[0];
        var context = canvas.getContext('2d');

        if (active_monat == 0) {
            canvas_image_height = 420;
        } else {
            canvas_image_height = 360;
        }

        var KoefCanvas = canvas.width / constants.canvas_width;


        var resize_image = $(this).parent().parent().parent().parent().parent().find('.resize-image');

        var image_width = resize_image.data('width');
        var image_height = resize_image.data('height');
        var KoefImg = resize_image.data('KoefImg');
        var xPosCSS = resize_image.data('xPosCSS');
        var yPosCSS = resize_image.data('yPosCSS');

        var xImg, yImg;
        var canvas_width, canvas_height;

        canvas_width = canvas.width;
        canvas_height = canvas.height;

        /*
        - pomeranje slike u dole desno radi!
        */

        //izracunati left i top polozaj slike u xPosCSS, yPosCSS
        xImg = xPosCSS;
        yImg = yPosCSS;
        if (xPosCSS < 0) {
            xImg = Math.abs(xPosCSS * KoefImg);
            image_width = image_width - xImg;
            if (image_width > canvas_width * KoefImg / KoefCanvas) {
                image_width = canvas_width * KoefImg / KoefCanvas
            };
            xPosCSS = 0;
        } else {
            xPosCSS = (xPosCSS * KoefCanvas);
            xImg = 0;
            if (image_width > (canvas_width - xPosCSS) * KoefImg / KoefCanvas) {
                image_width = (canvas_width - xPosCSS) * KoefImg / KoefCanvas;
            }
        };

        if (yPosCSS < 0) {
            yImg = Math.abs(yPosCSS * KoefImg);
            image_height = image_height - yImg;
            if (image_height > (canvas_height - (constants.canvas_height - canvas_image_height) * KoefCanvas) * KoefImg / KoefCanvas) {
                image_height = (canvas_height - (constants.canvas_height - canvas_image_height) * KoefCanvas) * KoefImg / KoefCanvas
            };
            yPosCSS = 0;
        } else {
            yPosCSS = (yPosCSS * KoefCanvas);
            yImg = 0;
            if (image_height > (canvas_height - (constants.canvas_height - canvas_image_height) * KoefCanvas - yPosCSS) * KoefImg / KoefCanvas) {
                image_height = (canvas_height - (constants.canvas_height - canvas_image_height) * KoefCanvas - yPosCSS) * KoefImg / KoefCanvas;
            };
        };

        canvas_width = image_width * KoefCanvas / KoefImg;
        canvas_height = image_height * KoefCanvas / KoefImg;
        $('#canvas' + active_monat).attr({ 'title': 'Canvas' });
        context.drawImage(resize_image[0], xImg, yImg, image_width, image_height, xPosCSS, yPosCSS, canvas_width, canvas_height);
        canvas_counter = canvas_counter + 1;
        resize_image.attr('src', canvas.toDataURL("image/jpeg", 0.95));

        $(this).parent().parent().parent().parent().parent().find('.div44').hide();


        $(this).prop('disabled', true);


        if (canvas_counter < 3) {
            $('#btnUpload').prop('disabled', true);
        } else {
            $('#btnUpload').prop('disabled', false);
        }

    });



























    /* --------------------------------------------------------------------------------------------------------------*/
});

/* ------------------  funkcije   -------------------------------------- */

function insertMounths(active_monat) {
    //get involved variables first
    var canvas = $('#canvas' + active_monat)[0];
    var context = canvas.getContext('2d');


    if (!canvas.hasAttribute('title')) {
        $('#spinner').show();


        //draw kalender template on canvas
        var imgCanvas = new Image();
        imgCanvas.src = '../images/H/Kalendar' + active_monat + '.jpg';
        imgCanvas.onload = function() {

            canvas.height = this.height;
            canvas.width = this.width;

            context.drawImage(imgCanvas, 0, 0);
            $('#spinner').hide();

            $('#canvas' + active_monat).css({ 'width': constants.canvas_width, 'height': constants.canvas_height });
            $('#canvas' + active_monat).attr({ 'title': 'Canvas' });
            imgCanvas = null;

        };

    }
}

function imageRotate() {
    //get involved variables first
    var canvas = $('#canvas' + active_monat)[0];
    var ctx = canvas.getContext('2d');

    var angleInDegrees = 0;

    var image = $(this).parent().parent().parent().parent().find('.resize-image');
    image.onload = function() {
        ctx.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.width / 2);
    }


    $("#clockwise").click(function() {
        angleInDegrees += 90;
        drawRotated(angleInDegrees);
    });

    $("#counterclockwise").click(function() {
        angleInDegrees -= 90;
        drawRotated(angleInDegrees);
    });

    function drawRotated(degrees) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(degrees * Math.PI / 180);
        ctx.drawImage(image, -image.width / 2, -image.width / 2);
        ctx.restore();
    }

}