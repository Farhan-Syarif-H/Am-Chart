import React, { useEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const DonutChart = () => {
  useEffect(() => {
    // Ensure there's only one instance of the chart by disposing any previous root
    let root = am5.Root.new("donut");

    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    // Create chart
    let chart = root.container.children.push(am5percent.PieChart.new(root, {
      layout: root.verticalLayout,
      innerRadius: am5.percent(50)
    }));

    // Create series
    let series = chart.series.push(am5percent.PieSeries.new(root, {
      valueField: "value",
      categoryField: "category",
      alignLabels: false
    }));

    series.labels.template.setAll({
      textType: "circular",
      centerX: 0,
      centerY: 0
    });

    // Set data
    series.data.setAll([
      { value: 10, category: "One" },
      { value: 9, category: "Two" },
      { value: 6, category: "Three" },
      { value: 5, category: "Four" },
      { value: 4, category: "Five" },
      { value: 3, category: "Six" },
      { value: 1, category: "Seven" },
    ]);

    // Create legend
    let legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      marginTop: 15,
      marginBottom: 15,
    }));

    legend.data.setAll(series.dataItems);

    // Play initial series animation
    series.appear(1000, 100);

    // Cleanup to avoid multiple roots
    return () => {
      root.dispose();
    };
  }, []);

  return <div id="donut" style={{ width: "100%", height: "500px" }}></div>;
};

export default DonutChart;
