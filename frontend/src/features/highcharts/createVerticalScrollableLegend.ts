import Highcharts from "highcharts";

const createVerticalScrollableLegend = (H: typeof Highcharts) => {
  const { defined } = H;

  H.addEvent(H.Legend, "afterRender", function () {
    const legend = this,
      chart = legend.chart,
      { custom, useHTML, layout } = legend.options,
      isHorizontal = layout === "horizontal";

    if (
      defined(custom) &&
      defined(custom.scrollableLegendArea) &&
      useHTML &&
      legend.group.div
    ) {
      const { minHeight, minWidth } = custom.scrollableLegendArea;

      if (!legend.legendWrapper) {
        // Create additional SVG element to put inside additional div
        // after first render
        legend.legendWrapper = chart.renderer.createElement("svg").attr({
          version: "1.1",
          class: "highcharts-scrollable-legend",
          height: legend.legendHeight,
          width: isHorizontal
            ? legend.contentGroup.getBBox().width
            : legend.legendWidth,
        });
      }
      const { element } = legend.legendWrapper;
      // Move legend group to the new SVG element
      legend.group.add(legend.legendWrapper);

      // Add SVG element to div
      legend.group.div.appendChild(element);

      // Add style to use native browser scrollbar
      legend.group.div.style.overflow = "auto";

      if (minHeight) {
        legend.group.div.style.height = minHeight + "px";
        // Overwrite legend's height
        legend.legendHeight = minHeight;
      }
      if (minWidth) {
        legend.group.div.style.width = minWidth + "px";
        // Overwrite legend's width
        legend.legendWidth = minWidth;
      }

      legend.align();
      legend.group.element.removeAttribute("transform");
    }
  });
};

export default createVerticalScrollableLegend;
