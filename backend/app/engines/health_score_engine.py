from typing import List, Dict, Any

class HealthScoreEngine:
    """
    Computes real-time dynamic health scores for cloud infrastructure.
    Evaluates:
    - Overall Health (0-100)
    - Performance (CPU, Latency, Throughput)
    - Reliability (Error rate, SLA, Incident count)
    - Security (Open CVEs, IAM, Public Ports, Encryption)
    - Cost Efficiency (Resource utilization, idle waste)
    """

    @staticmethod
    def calculate_health_scores(
        resources: List[Dict[str, Any]],
        incidents: List[Dict[str, Any]],
        security_findings: List[Dict[str, Any]],
        cost_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        # 1. Performance Score Calculation
        perf_deductions = 0.0
        total_res = max(1, len(resources))
        
        for r in resources:
            cpu = r.get("cpu_utilization", 0.0)
            latency = r.get("latency_p95_ms", 0.0)
            error_rate = r.get("error_rate", 0.0)
            
            if cpu > 85.0:
                perf_deductions += 18.0
            elif cpu > 70.0:
                perf_deductions += 8.0

            if latency > 1500.0:
                perf_deductions += 20.0
            elif latency > 500.0:
                perf_deductions += 8.0

            if error_rate > 3.0:
                perf_deductions += 15.0

        performance_score = max(20.0, min(100.0, 100.0 - (perf_deductions / (total_res * 0.4))))

        # 2. Reliability Score Calculation
        rel_deductions = 0.0
        for inc in incidents:
            status = inc.get("status", "detected")
            if status in ["detected", "investigating"]:
                sev = inc.get("severity", "medium").lower()
                if sev == "critical":
                    rel_deductions += 25.0
                elif sev == "high":
                    rel_deductions += 15.0
                elif sev == "medium":
                    rel_deductions += 8.0
                else:
                    rel_deductions += 3.0
            elif status == "mitigated":
                rel_deductions += 4.0

        reliability_score = max(25.0, min(100.0, 100.0 - rel_deductions))

        # 3. Security Score Calculation
        sec_deductions = 0.0
        for f in security_findings:
            if f.get("status", "open") == "open":
                sev = f.get("severity", "medium").lower()
                if sev == "critical":
                    sec_deductions += 16.0
                elif sev == "high":
                    sec_deductions += 9.0
                elif sev == "medium":
                    sec_deductions += 4.0
                else:
                    sec_deductions += 1.0

        security_score = max(30.0, min(100.0, 100.0 - sec_deductions))

        # 4. Cost Efficiency Score
        cost_efficiency = cost_data.get("cost_efficiency_score", 92.0)

        # Weighted Overall Score
        overall = (
            performance_score * 0.30 +
            reliability_score * 0.30 +
            security_score * 0.25 +
            cost_efficiency * 0.15
        )

        overall = round(max(10.0, min(99.8, overall)), 1)
        perf_score = round(performance_score, 1)
        rel_score = round(reliability_score, 1)
        sec_score = round(security_score, 1)
        cost_score = round(cost_efficiency, 1)

        if overall >= 90.0:
            status_label = "Optimal"
        elif overall >= 75.0:
            status_label = "Degraded"
        elif overall >= 55.0:
            status_label = "Warning"
        else:
            status_label = "Critical Action Required"

        return {
            "overall": overall,
            "performance": perf_score,
            "reliability": rel_score,
            "security": sec_score,
            "cost_efficiency": cost_score,
            "status_label": status_label
        }
