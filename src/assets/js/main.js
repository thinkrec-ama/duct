var THINKREC = THINKREC || {};

THINKREC.HEADER_DISPLAY = {
    init: function () {
        this.setParameters();
        this.bindEvent();
    },
    setParameters: function () {
        this.$header = $(".jsc-header");
        this.$footer = $(".jsc-footer");
        this.$windowHeight = $(window).height();
        this.$documentHeight = $(document).height();
        this.$footerHeight = this.$footer.height();
    },
    bindEvent: function () {
        var myself = this;
        $(window).resize(function () {
            myself.$header.css("top", "0");
        });
        $(window).on("scroll", function () {
            myself.scrollDocument();
        });
    },
    scrollDocument: function () {
        var winScrollTop = $(window).scrollTop();
        if (
            winScrollTop >=
            this.$documentHeight - (this.$windowHeight + this.$footerHeight)
        ) {
            this.$header.addClass("hide");
        } else {
            this.$header.removeClass("hide");
        }
    },
};
THINKREC.PAGETOP_CONTROLLER = {
    ANIMATION_TIME: 700,
    TOP_OFFSET: 0,
    init: function () {
        this.setParameters();
        this.bindEvent();
    },
    setParameters: function () {
        this.$scrollBtn = $(".jscScrollBtn");
        this.$body = $("html, body");
    },
    bindEvent: function () {
        this.$scrollBtn.on("click", $.proxy(this.scrollMove, this));
    },
    scrollMove: function (event) {
        event.preventDefault();
        this.$body.animate({ scrollTop: this.TOP_OFFSET }, this.ANIMATION_TIME);
    },
};

$(window).on("load", function () {
    THINKREC.HEADER_DISPLAY.init();
    THINKREC.PAGETOP_CONTROLLER.init();
    $(".loadingWrap").delay(1500).fadeOut('slow');
    $(".loadingLogoWrap").delay(1200).fadeOut('slow');
});