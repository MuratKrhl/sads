import React, { useMemo } from 'react';
import { SERVER_INVENTORY_DATA, APPLICATION_INVENTORY_DATA, OPENSHIFT_INVENTORY_DATA, KDB_CERTIFICATE_DATA, JAVA_CERTIFICATE_DATA } from '@/utils/constants';
import { ChartDataItem } from '@/utils/types';

// SciChart
import { SciChartReact } from "scichart-react";
import {
    SciChartPieSurface,
    PieSegment,
    EPieType,
    ESizingMode,
    GradientParams,
    Point,
    ELegendOrientation,
    ELegendPlacement,
    SciChartJSLightTheme,
    IThemeProvider
} from "scichart";

export interface AppThemeBase {
    SciChartJsTheme: IThemeProvider;
    ForegroundColor: string;
    Background: string;
    VividSkyBlue: string;
    VividPink: string;
    VividTeal: string;
    VividOrange: string;
    VividBlue: string;
    VividPurple: string;
    VividGreen: string;
    VividRed: string;
    MutedSkyBlue: string;
    MutedPink: string;
    MutedTeal: string;
    MutedOrange: string;
    MutedBlue: string;
    MutedPurple: string;
    MutedRed: string;
}

export class SciChartAppThemeLight implements AppThemeBase {
    SciChartJsTheme = new SciChartJSLightTheme();
    ForegroundColor = "#374151";
    Background = this.SciChartJsTheme.sciChartBackground;
    VividSkyBlue = "#50C7E0";
    VividPink = "#EC0F6C";
    VividTeal = "#30BC9A";
    VividOrange = "#F48420";
    VividBlue = "#364BA0";
    VividPurple = "#882B91";
    VividGreen = "#67BDAF";
    VividRed = "#C52E60";
    MutedSkyBlue = "#83D2F5";
    MutedPink = "#DF69A8";
    MutedTeal = "#7BCAAB";
    MutedOrange = "#E7C565";
    MutedBlue = "#537ABD";
    MutedPurple = "#A16DAE";
    MutedRed = "#DC7969";
}

const appTheme = new SciChartAppThemeLight();

// Kendo React
import { Chart, ChartLegend, ChartSeries, ChartSeriesItem, ChartTitle } from '@progress/kendo-react-charts';

// AgCharts
import { AgCharts } from "ag-charts-react";
import {
    AnimationModule,
    ChordSeriesModule,
    ContextMenuModule,
    CrosshairModule,
    LegendModule,
    ModuleRegistry,
    SunburstSeriesModule
} from "ag-charts-enterprise";

ModuleRegistry.registerModules([
    AnimationModule,
    ChordSeriesModule,
    CrosshairModule,
    LegendModule,
    ContextMenuModule,
    SunburstSeriesModule
]);

export default function DashboardInventoryChartsCard() {
    // 1. SCICHART DONUT: Total Server, Linux, AIX
    const { totalServer, linuxServer, aixServer, otherServer } = useMemo(() => {
        const total = SERVER_INVENTORY_DATA.length;
        const linux = SERVER_INVENTORY_DATA.filter(s => s.os.toLowerCase().includes('rhel') || s.os.toLowerCase().includes('ubuntu')).length;
        const aix = SERVER_INVENTORY_DATA.filter(s => s.os.toLowerCase().includes('aix')).length;
        return { totalServer: total, linuxServer: linux, aixServer: aix, otherServer: total - linux - aix };
    }, []);

    const drawDonutChart = async (rootElement: string | HTMLDivElement) => {
        const sciChartPieSurface = await SciChartPieSurface.create(rootElement, {
            theme: appTheme.SciChartJsTheme,
            pieType: EPieType.Donut,
            holeRadius: 0.6,
            holeRadiusSizingMode: ESizingMode.Relative,
            animate: true,
            seriesSpacing: 10,
            showLegend: true,
            showLegendSeriesMarkers: true,
            animateLegend: true,
        });

        // Optional placement of legend
        sciChartPieSurface.legend.orientation = ELegendOrientation.Vertical;
        sciChartPieSurface.legend.placement = ELegendPlacement.TopLeft;

        const dataset = [
            { name: "Linux", value: linuxServer },
            { name: "AIX", value: aixServer },
            { name: "Other", value: otherServer },
        ];

        const colors = [
            { color1: appTheme.VividTeal, color2: appTheme.MutedTeal },
            { color1: appTheme.VividBlue, color2: appTheme.MutedBlue },
            { color1: appTheme.VividPurple, color2: appTheme.MutedPurple },
        ];

        const radiusSize = [0.85, 0.9, 0.95];

        const toPieSegment = (name: string, value: number, radiusAdjustment: number, color1: string, color2: string) => {
            return new PieSegment({
                value,
                text: name,
                labelStyle: { color: appTheme.ForegroundColor },
                radiusAdjustment,
                showLabel: value > 0,
                colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                    { color: color1, offset: 0 },
                    { color: color2 || color1 + "77", offset: 1 },
                ]),
            });
        };

        const pieSegments = dataset.map((row, index) =>
            toPieSegment(row.name, row.value, radiusSize[index % radiusSize.length], colors[index % colors.length].color1, colors[index % colors.length].color2)
        );

        sciChartPieSurface.pieSegments.add(...pieSegments);

        return { sciChartSurface: sciChartPieSurface };
    };

    // 2. KENDO PIE: Applications
    const kendoSeries = useMemo(() => {
        const counts: Record<string, number> = {
            Jboss: 0, WebSphere: 0, Nginx: 0, Openshift: OPENSHIFT_INVENTORY_DATA.length,
            Evam: 0, PowerCurve: 0, Provenir: 0, Wyden: 0, LinuxOne: 0
        };

        const serverMap = new Map(SERVER_INVENTORY_DATA.map(s => [s.hostname, s]));

        APPLICATION_INVENTORY_DATA.forEach(app => {
            const server = serverMap.get(app.hostname);
            if (server?.jbossVersion) counts.Jboss++;
            else if (server?.webSphereVersion) counts.WebSphere++;

            if (app.middlewareInfo?.toLowerCase().includes('nginx')) counts.Nginx++;
            if (app.middlewareInfo?.toLowerCase().includes('evam')) counts.Evam++;
            if (app.middlewareInfo?.toLowerCase().includes('powercurve')) counts.PowerCurve++;
            if (app.middlewareInfo?.toLowerCase().includes('provenir')) counts.Provenir++;
            if (app.middlewareInfo?.toLowerCase().includes('wyden')) counts.Wyden++;
            if (app.middlewareInfo?.toLowerCase().includes('linuxone')) counts.LinuxOne++;
        });

        // Ensure we only pass categories with value > 0 for a cleaner pie, but let's just pass all as requested.
        return Object.entries(counts).map(([category, value]) => ({ category, value }));
    }, []);

    const labelContent = (props: any) => {
        return `${props.dataItem.category}: ${props.dataItem.value}`;
    };

    // 3. AG-CHARTS CHORD: KDB Certificate
    const chordOptions = useMemo(() => {
        const flowMap: Record<string, number> = {};
        KDB_CERTIFICATE_DATA.forEach(cert => {
            const key = `${cert.environment}|${cert.issuer}`;
            flowMap[key] = (flowMap[key] || 0) + 1;
        });

        const data = Object.entries(flowMap).map(([key, size]) => {
            const [from, to] = key.split('|');
            return { from, to, size };
        });

        return {
            title: { text: "KDB Certificate Relationships" },
            subtitle: { text: "Environment to Issuer" },
            data,
            series: [{
                type: "chord" as const,
                fromKey: "from",
                toKey: "to",
                sizeKey: "size",
                node: { strokeWidth: 2 }
            }],
        };
    }, []);

    // 4. AG-CHARTS SUNBURST: Java Certificate
    const sunburstOptions = useMemo(() => {
        const hierarchy: Record<string, Record<string, number>> = {};
        JAVA_CERTIFICATE_DATA.forEach(cert => {
            if (!hierarchy[cert.environment]) hierarchy[cert.environment] = {};
            hierarchy[cert.environment][cert.issuer] = (hierarchy[cert.environment][cert.issuer] || 0) + 1;
        });

        const data = Object.entries(hierarchy).map(([env, issuers]) => ({
            name: env,
            children: Object.entries(issuers).map(([issuer, count]) => ({
                name: issuer,
                count: count
            }))
        }));

        return {
            title: { text: "Java Certificates Hierarchy" },
            subtitle: { text: "Environment vs Issuer" },
            data: data,
            series: [{
                type: "sunburst" as const,
                labelKey: "name",
                sizeKey: "count",
            }],
        };
    }, []);


    return (
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Inventory Overview</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 gap-y-12">

                {/* 1. SciChart Donut */}
                <div className="flex flex-col h-80 relative">
                    <div style={{ width: "100%", height: "100%" }}>
                        <SciChartReact initChart={drawDonutChart} />
                    </div>
                    <span
                        className="pointer-events-none"
                        style={{
                            color: "#374151",
                            fontWeight: "bold",
                            fontSize: 18,
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            textAlign: "center"
                        }}
                    >
                        Total Server<br />{totalServer}
                    </span>
                </div>

                {/* 2. Kendo React Pie */}
                <div className="flex flex-col h-80">
                    <Chart style={{ height: "100%" }}>
                        <ChartTitle text="Uygulamalar" />
                        <ChartLegend position="bottom" />
                        <ChartSeries>
                            <ChartSeriesItem
                                type="pie"
                                data={kendoSeries}
                                field="value"
                                categoryField="category"
                                labels={{ visible: true, content: labelContent }}
                            />
                        </ChartSeries>
                    </Chart>
                </div>

                {/* 3. AgCharts Chord */}
                <div className="flex flex-col h-80">
                    <AgCharts options={chordOptions} />
                </div>

                {/* 4. AgCharts Sunburst */}
                <div className="flex flex-col h-80">
                    <AgCharts options={sunburstOptions} />
                </div>

            </div>
        </div>
    );
}
