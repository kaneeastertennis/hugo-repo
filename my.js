<script>
function renderPDF(lib, $div) {
    var div = $div[0];
    const url = $div.attr('data-file');
    console.log("url=", url);
    $div.empty();
    
    var $canvas = $('<canvas>').appendTo($div);
    const $footer = $("<div>").addClass("pdf-footer").appendTo($div);
    var $btnPrev = $('<button>').text('prev').css({'margin': '10px', 'padding': '10px'}).appendTo($footer);
    var $btnNext = $('<button>').text('next').css({'margin': '10px', 'padding': '10px'}).appendTo($footer);
    var $spanPageNumber = $('<span>').css({}).appendTo($footer);
    $footer.append("<span>/<span>");
    var $spanPageCount = $('<span>').appendTo($footer);
    var $link = $("<a>")
        .addClass("btn")
        .css({'border': 'thin solid black', 'margin': '10px'})
        .text("Download").attr('href', url).appendTo($footer);
    
    var pdfDoc = null,
        pageNum = 1,
        pageRendering = false,
        pageNumPending = null,
        scale = 1.0,
        canvas = $canvas[0],
        ctx = canvas.getContext('2d');
    
    var renderPage = (num) => {
        pageRendering = true;
        pdfDoc.getPage(num).then((page) => {
            docWidth = page.getViewport({scale:2.0}).width;
            // var scale = docWidth / canvas.width;
            var scale = 2.0;
            console.log("scale = ", scale, docWidth);
            var viewport = page.getViewport({scale:scale});
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            var renderContext = {
                canvasContext:ctx,
                viewport: viewport,
            };
            var renderTask = page.render(renderContext);
            renderTask.promise.then(() => {
                pageRendering = false;
                if(pageNumPending != null) {
                    renderPage(pageNumPending);
                    pageNumPending = null;
                }
            });
        });
        $spanPageNumber.text(num);
    }
    
    var queueRenderPage = (num) => {
        if(pageRendering) {
            pageNumPending = num;
        } else {
            renderPage(num);
        }
    };

    lib.getDocument(url).promise.then((doc) => {
        pdfDoc = doc;
        $spanPageCount.text(pdfDoc.numPages);
        renderPage(pageNum);
        
        $btnPrev.click(() => {
            if(pageNum <= 1) return;
            pageNum --;
            queueRenderPage(pageNum);
        });
    
        $btnNext.click(() => {
            if(pageNum >= pdfDoc.numPages) return;
            pageNum ++;
            queueRenderPage(pageNum);
        });
    });
    
}
$(function() {
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
    const $div = $(".pdf").each((index, element) => {
        renderPDF(pdfjsLib, $(element));
    });
});
</script>