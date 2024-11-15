import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CpuChartComponent } from './components/cpu-chart/cpu-chart.component';

@Component({
  standalone: true,
  imports: [RouterModule, CpuChartComponent],
  selector: 'app-root',
  template: `
    <div class="min-h-screen bg-gray-900 text-white p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-100">CPU Usage Monitor</h1>
      <app-cpu-chart></app-cpu-chart>
    </div>
  `
})
export class AppComponent {
  title = 'wsDemo';
}
