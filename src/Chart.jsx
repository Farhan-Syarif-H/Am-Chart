import { useRef, useLayoutEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function Chart(props) {
    const chartRef = useRef(null);

  
    useLayoutEffect(() => {
        let root = am5.Root.new("chartdiv");
    
        // Buat tema kustom
        const myTheme = am5.Theme.new(root);
        myTheme.rule("Grid").setAll({
            stroke: am5.color(0x00FF00), // Warna hijau
            strokeWidth: 2
        });
    
        // Buat animasi tema
        const myAnimation = am5themes_Animated.new(root);
    
        // Set tema pada chart
        root.setThemes([
            myTheme, 
            myAnimation // Dipisahkan dengan koma
        ]);
    
    

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panY: false,
                layout: root.verticalLayout
            })
        );

        // Define data
        let data = [{
            category: "Laptop",
            value1: 150,
            value2: 180,
            value3: 170
        }, {
            category: "SmartPhone",
            value1: 300,
            value2: 250,
            value3: 280
        },
        {
            category: "Tablet",
            value1: 120,
            value2: 140,
            value3: 130
        }, {
            category: "Headphone",
            value1: 200,
            value2: 210,
            value3: 220
        },{
            category: "SmartWatch",
            value1: 180,
            value2: 160,
            value3: 190
        }];

        // Create Y-axis
        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                logarithmic: true,
                extraTooltipPrecision: 1,
                renderer: am5xy.AxisRendererY.new(root, {})
            })
        );

        // Create X-Axis
        let xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                renderer: am5xy.AxisRendererX.new(root, {}),
                categoryField: "category"
            })
        );
        xAxis.data.setAll(data);

        // Create series
        let series1 = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: "Cabang A",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "value1",
                categoryXField: "category"
            })
        );
        series1.data.setAll(data);

        let series2 = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: "Cabang B",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "value2",
                categoryXField: "category"
            })
        );
        series2.data.setAll(data);

        let series3 = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: "Cabang C",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "value3",
                categoryXField: "category"
            })
        );
        series3.data.setAll(data);

        // Add legend
        let legend = chart.children.push(am5.Legend.new(root, {}));
        legend.data.setAll(chart.series.values);

        // Add cursor
        chart.set("cursor", am5xy.XYCursor.new(root, {}));

        chartRef.current = chart;

        return () => {
            root.dispose();
        };
    }, []);

    // When the paddingRight prop changes it will update the chart
    useLayoutEffect(() => {
        chartRef.current.set("paddingRight", props.paddingRight);
    }, [props.paddingRight]);

    return (
        <div id="chartdiv" style={{ width: "100vh", height: "500px" }}></div>
    );
}
export default Chart;