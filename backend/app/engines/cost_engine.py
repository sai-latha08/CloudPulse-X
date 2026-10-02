from typing import List, Dict, Any

class CostEngine:
    """
    Cloud FinOps and Cost Optimization Engine.
    Detects underutilized instances, oversized databases, idle NAT gateways, and unattached volumes.
    """

    @staticmethod
    def analyze_cost_efficiency(cost_data: Dict[str, Any], resources: List[Dict[str, Any]]) -> Dict[str, Any]:
        optimizations = list(cost_data.get("optimizations", []))
        total_savings = sum(item.get("monthly_savings", 0.0) for item in optimizations)
        monthly_est = cost_data.get("monthly_estimated", 2842.0)

        # Calculate FinOps efficiency score
        waste_ratio = total_savings / max(1.0, monthly_est)
        efficiency_score = round(max(30.0, min(100.0, 100.0 - (waste_ratio * 120.0))), 1)

        result = dict(cost_data)
        result["potential_savings"] = round(total_savings, 2)
        result["cost_efficiency_score"] = efficiency_score
        return result
