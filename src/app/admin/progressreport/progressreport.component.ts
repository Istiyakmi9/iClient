import { Component, OnInit } from "@angular/core";
import { Chart } from "chart.js";

@Component({
  selector: "app-progressreport",
  templateUrl: "./progressreport.component.html",
  styleUrls: ["./progressreport.component.scss"]
})
export class ProgressreportComponent implements OnInit {
  chartBar = [];
  StudentAttendanceData: any;
  CoScholasticData: Array<CoScholasticAreaModal>;
  SubjectReport: Array<ProgressResultModal>;
  IsReady: boolean;

  constructor() {
    this.IsReady = false;
  }

  ngOnInit(): void {
    this.InitTemporaryData();
    this.IsReady = true;
  }

  data = {
    labels: [
      "English",
      "Hindi",
      "Mathamatics",
      "Science",
      "Social Stydy",
      "Foundation of IT"
    ],
    datasets: [
      {
        label: "Obtainer Marks",
        data: [50, 100, 60, 120, 80, 100, 60],
        backgroundColor: "rgba(255, 99, 132, 0.4)",
        borderColor: "rgba(255,99,132,.6)",
        borderWidth: 1
      }
    ]
  };
  options = {
    scales: {
      yAxes: [
        {
          ticks: {
            fontColor: "rgba(0,0,0,.6)",
            fontStyle: "bold",
            beginAtZero: true,
            maxTicksLimit: 8,
            padding: 10
          },
          gridLines: {
            drawTicks: true,
            drawBorder: true,
            display: true,
            color: "rgba(0,0,0,.1)"
            // zeroLineColor: 'transparent'
          }
        }
      ],
      xAxes: [
        {
          gridLines: {
            // zeroLineColor: 'transparent',
            display: true
          },
          ticks: {
            padding: 0,
            fontColor: "rgba(0,0,0,0.6)",
            fontStyle: "bold"
          }
        }
      ]
    },
    responsive: true
  };

  InitTemporaryData() {
    this.chartBar = new Chart("sales-bar", {
      type: "bar",
      data: this.data,
      options: this.options
    });

    this.StudentAttendanceData = {
      TotalAttendance: 219,
      TotalPresent: 194,
      AttendancePercent: 80
    };

    this.CoScholasticData = [
      {
        Name: "WORK EDUCATION",
        Grade: "A"
      },
      {
        Name: "ART EDUCATION",
        Grade: "A"
      },
      {
        Name: "HEALTH AND PHYSICAL EDUCATION",
        Grade: "B"
      },
      {
        Name: "DESCIPLINE",
        Grade: "A"
      }
    ];

    this.SubjectReport = [
      {
        SubjectName: "English",
        PeriodicTest: 9,
        Notebook: 4,
        SubjectEnrichment: 4,
        AnnualExam: 79,
        MarkedObtain: 89,
        Grade: "A"
      },
      {
        SubjectName: "Hindi",
        PeriodicTest: 9,
        Notebook: 4,
        SubjectEnrichment: 4,
        AnnualExam: 79,
        MarkedObtain: 89,
        Grade: "A"
      },
      {
        SubjectName: "Mathamatics",
        PeriodicTest: 9,
        Notebook: 4,
        SubjectEnrichment: 4,
        AnnualExam: 79,
        MarkedObtain: 89,
        Grade: "A"
      },
      {
        SubjectName: "Science",
        PeriodicTest: 9,
        Notebook: 4,
        SubjectEnrichment: 4,
        AnnualExam: 79,
        MarkedObtain: 89,
        Grade: "A"
      },
      {
        SubjectName: "Social Study",
        PeriodicTest: 9,
        Notebook: 4,
        SubjectEnrichment: 4,
        AnnualExam: 79,
        MarkedObtain: 89,
        Grade: "A"
      },
      {
        SubjectName: "Foundation of IT",
        PeriodicTest: 9,
        Notebook: 4,
        SubjectEnrichment: 4,
        AnnualExam: 79,
        MarkedObtain: 89,
        Grade: "A"
      }
    ];
  }
}

interface ProgressResultModal {
  SubjectName: string;
  PeriodicTest: number;
  Notebook: number;
  SubjectEnrichment: number;
  AnnualExam: number;
  MarkedObtain: number;
  Grade: string;
}

interface CoScholasticAreaModal {
  Name: string;
  Grade: string;
}
