import { Component, OnInit } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { WebSocketService } from '../../services/websocket.service';
import { CommonModule } from '@angular/common';
import type { EChartsOption } from 'echarts';

@Component({
  selector: 'app-cpu-chart',
  standalone: true,
  imports: [NgxEchartsModule, CommonModule],
  template: `
    <div class="w-full h-[400px] p-4 bg-gray-800 rounded-lg">
      <div echarts 
           [options]="chartOptions" 
           [initOpts]="initOpts"
           class="w-full h-full"
           [merge]="mergeOptions()"
      ></div>
    </div>
  `
})
export class CpuChartComponent implements OnInit {
  chartOptions: EChartsOption = {
    backgroundColor: '#1F2937',
    title: {
      text: 'CPU Usage',
      textStyle: {
        color: '#E5E7EB'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#374151',
      borderColor: '#4B5563',
      textStyle: {
        color: '#E5E7EB'
      },
      formatter: (params: any) => {
        const dataIndex = params[0].dataIndex;
        const data = this.wsService.cpuData();
        const time = new Date(data[dataIndex].timestamp).toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        const value = data[dataIndex].cpuUsage.toFixed(2);
        return `Time: ${time}<br/>CPU Usage: ${value}%`;
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: [],
      axisLabel: {
        color: '#9CA3AF',
        formatter: (value: string) => {
          const date = new Date(value);
          return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
        },
        rotate: 90,
        margin: 8
      },
      axisLine: {
        lineStyle: {
          color: '#4B5563'
        }
      },
      name: 'Time',
      nameLocation: 'middle',
      nameGap: 45,
      nameTextStyle: {
        color: '#E5E7EB',
        fontSize: 14,
        padding: [10, 0, 0, 0]
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        color: '#9CA3AF',
        formatter: '{value}%'
      },
      axisLine: {
        lineStyle: {
          color: '#4B5563'
        }
      },
      name: 'CPU Usage',
      nameLocation: 'middle',
      nameGap: 50,
      nameTextStyle: {
        color: '#E5E7EB',
        fontSize: 14
      },
      splitLine: {
        lineStyle: {
          color: '#374151'
        }
      }
    },
    series: [{
      data: [],
      type: 'line',
      smooth: true,
      areaStyle: {
        opacity: 0.2,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#10B981'
          }, {
            offset: 1,
            color: 'rgba(16, 185, 129, 0.1)'
          }]
        }
      },
      lineStyle: {
        width: 2,
        color: '#10B981'
      },
      itemStyle: {
        color: '#10B981',
        borderWidth: 2
      },
      emphasis: {
        itemStyle: {
          borderWidth: 3,
          borderColor: '#34D399'
        }
      }
    }]
  };

  initOpts = {
    renderer: 'canvas'
  };

  constructor(private wsService: WebSocketService) { }

  ngOnInit() {
    this.wsService.connect();
  }

  mergeOptions(): EChartsOption {
    const data = this.wsService.cpuData();
    const labelIndices = data.reduce((acc: number[], _, index) => {
      if (index === data.length - 1 || index % 5 === 0) {
        acc.push(index);
      }
      return acc;
    }, []);

    return {
      xAxis: {
        data: data.map(item => item.timestamp),
        axisLabel: {
          showMinLabel: true,
          showMaxLabel: true,
          hideOverlap: true,
          interval: (index: number) => labelIndices.includes(index)
        }
      },
      series: [{
        data: data.map(item => Number(item.cpuUsage.toFixed(2)))
      }]
    };
  }
} 