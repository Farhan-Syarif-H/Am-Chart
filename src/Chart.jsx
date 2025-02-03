import { useRef, useLayoutEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function Chart(props) {
    const chartRef = useRef(null);

    useLayoutEffect(() => {
        let root = am5.Root.new("chartdiv");
        const myTheme = am5.Theme.new(root);
        myTheme.rule("Grid").setAll({
            stroke: am5.color(0x00FF00),
            strokeWidth: 2
        });
        const myAnimation = am5themes_Animated.new(root);
        root.setThemes([myTheme, myAnimation]);

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panY: false,
                layout: root.verticalLayout
            })
        );
        let data = [
            { category: "Laptop", value1: 150, value2: 180, value3: 170 },
            { category: "SmartPhone", value1: 300, value2: 250, value3: 280 },
            { category: "Tablet", value1: 120, value2: 140, value3: 130 },
            { category: "Headphone", value1: 200, value2: 210, value3: 220 },
            { category: "SmartWatch", value1: 180, value2: 160, value3: 190 }
        ];

        let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
            logarithmic: true,
            extraTooltipPrecision: 1,
            renderer: am5xy.AxisRendererY.new(root, {})
        }));

        let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
            renderer: am5xy.AxisRendererX.new(root, {}),
            categoryField: "category"
        }));
        xAxis.data.setAll(data);

        function createSeries(name, field) {
            let series = chart.series.push(am5xy.ColumnSeries.new(root, {
                name: name,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: field,
                categoryXField: "category"
            }));
            series.data.setAll(data);
            // series.set("tooltip", am5.Tooltip.new(root, {
            //     labelText: "{category}\n{name} : {valueY}"
            // }));
            series.columns.template.setAll({
                tooltipText: "{category}\n{name} : {valueY} {category}"
              });

            series.bullets.push(function (root) {
                return am5.Bullet.new(root, {});
            });
            series.bullets.push(function (root) {
                return am5.Bullet.new(root, {
                    locationX: 0.5,
                    locationY: 1.0, 
                    sprite: am5.Label.new(root, {
                        text: "{name}: {valueY}",
                        centerX: am5.percent(50),
                        centerY: am5.percent(100), 
                        populateText: true
                    })
                });
            });
            return series;
        }

        let series1 = createSeries("A", "value1");
        let series2 = createSeries("B", "value2");
        let series3 = createSeries("C", "value3");

        let legend = chart.children.push(am5.Legend.new(root, {}));
        legend.data.setAll(chart.series.values);
        legend.setAll({
            x: am5.percent(50),
            centerX: am5.percent(50),
            y: am5.percent(100),
            centerY: am5.percent(100)
        });

        let scrollbar = am5.Scrollbar.new(root, {
            orientation: "horizontal"
        });

        let tooltip = am5.Tooltip.new(root, {});

        tooltip.get("background").setAll({
            fill: am5.color(0xeeeeee)
        });


        scrollbar.set("tooltip", tooltip);

        scrollbar.startGrip.set("tooltipText", "Drag to zoom");
        scrollbar.endGrip.set("tooltipText", "Drag to zoom");

        chart.set("scrollbarX", scrollbar);

        chart.set("cursor", am5xy.XYCursor.new(root, {
            behavior: "none" // Hanya menampilkan tooltip untuk satu series
        }));

        chartRef.current = chart;

        return () => {
            root.dispose();
        };
    }, []);

    useLayoutEffect(() => {
        chartRef.current.set("paddingRight", props.paddingRight);
    }, [props.paddingRight]);

    return <div id="chartdiv" style={{ width: "100vh", height: "500px" }}></div>;
}

export default Chart;
