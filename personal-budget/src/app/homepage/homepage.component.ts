import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';
import { DataService } from '../data.service';
// import { DataService } from '../data.service';
@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

  public dataSource: any = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
          '#33FF57',
          '#33FFFF',
          '#FF33FF',
      ],
      }
    ],

    labels: []
  };

  public dataSource1: any = [];

  public svg: any;
  public width = 1500;
  public height = 600;
  public radius = Math.min(this.width, this.height) / 2;
  public colors: any;

  public createSvg(): void {
    this.svg = d3.select("#d3js")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
      .attr(
        "transform",
        "translate(" + this.width / 2 + "," + this.height / 2 + ")"
      );
  }
  public createColors(): void {
    this.colors = d3.scaleOrdinal()
      .domain(this.dataService.getDataSource1().map((d: any) => d.value))
      .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);
  }

  private drawChart(): void {
    // Compute the position of each group on the pie:
    const pie = d3.pie<any>().value((d: any) => Number(d.value));

    // Build the pie chart
    this.svg
      .selectAll('pieces')
      .data(pie(this.dataService.getDataSource1()))
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(this.radius)
      )
      .attr('fill', (d: any, i: any) => (this.colors(i)))
      .attr("stroke", "#121926")
      .style("stroke-width", "1px");

    // Add labels
    const labelLocation = d3.arc()
      .innerRadius(100)
      .outerRadius(this.radius);

    this.svg
      .selectAll('pieces')
      .data(pie(this.dataService.getDataSource1()))
      .enter()
      .append('text')
      .text((d: any) => d.data.label)
      .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
      .style("text-anchor", "middle")
      .style("font-size", 15);
  }

  constructor(private http: HttpClient, public dataService: DataService) {

  }
  ngAfterViewInit(): void {
    if (
      this.dataService.getDataSource().datasets[0].data.length == 0 ||
      this.dataService.getDataSource1().length == 0
    ) {
      this.dataService.fetchDataFromBackend().subscribe((res: any) => {
        for (var i = 0; i < res.myBudget.length; i++) {
          this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
          this.dataSource.labels[i] = res.myBudget[i].title;

          this.dataSource1.push({
            "label": res.myBudget[i].title,
            "value": res.myBudget[i].budget,
          });
        }
        this.dataService.setDataSource(this.dataSource);
        this.dataService.setDataSource1(this.dataSource1);

        this.createChart();
        this.createSvg();
        this.createColors();
        this.drawChart();
      });
    }
    else {
      this.createChart();
      this.createSvg();
      this.createColors();
      this.drawChart();

    }
  }


  createChart() {
    var ctx = <HTMLCanvasElement>document.getElementById("myChart");
    var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: this.dataService.getDataSource()
    });
  }
}