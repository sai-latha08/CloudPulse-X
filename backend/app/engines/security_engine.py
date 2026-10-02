from typing import List, Dict, Any

class SecurityEngine:
    """
    Evaluates cloud security posture across:
    - IAM (least privilege, admin roles, access keys)
    - Security Groups (open SSH/RDP/ports)
    - S3 Buckets (public access block, default encryption KMS)
    - Network / Infrastructure (VPC routing, public endpoints)
    """

    @staticmethod
    def audit_security_posture(findings: List[Dict[str, Any]]) -> Dict[str, Any]:
        critical_count = len([f for f in findings if f.get("severity") == "critical" and f.get("status") == "open"])
        high_count = len([f for f in findings if f.get("severity") == "high" and f.get("status") == "open"])
        medium_count = len([f for f in findings if f.get("severity") == "medium" and f.get("status") == "open"])
        low_count = len([f for f in findings if f.get("severity") == "low" and f.get("status") == "open"])

        by_category = {
            "iam": len([f for f in findings if f.get("category") == "iam" and f.get("status") == "open"]),
            "security_group": len([f for f in findings if f.get("category") == "security_group" and f.get("status") == "open"]),
            "s3": len([f for f in findings if f.get("category") == "s3" and f.get("status") == "open"]),
            "infrastructure": len([f for f in findings if f.get("category") == "infrastructure" and f.get("status") == "open"])
        }

        # Security Score formula
        deductions = (critical_count * 20.0) + (high_count * 10.0) + (medium_count * 4.0) + (low_count * 1.0)
        security_score = round(max(20.0, min(100.0, 100.0 - deductions)), 1)

        return {
            "total_findings": len(findings),
            "critical_count": critical_count,
            "high_count": high_count,
            "medium_count": medium_count,
            "low_count": low_count,
            "security_score": security_score,
            "by_category": by_category,
            "findings": findings
        }
