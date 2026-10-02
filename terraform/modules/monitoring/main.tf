# Monitoring Module (CloudWatch Alarms for CPU, Latency & Error Rates)
resource "aws_cloudwatch_metric_alarm" "high_cpu_alarm" {
  alarm_name          = "${var.environment}-high-cpu-utilization"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "60"
  statistic           = "Average"
  threshold           = "75"
  alarm_description   = "Triggered when compute instance CPU exceeds 75% for 2 consecutive minutes."

  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_cloudwatch_metric_alarm" "high_latency_alarm" {
  alarm_name          = "${var.environment}-high-alb-latency"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "2"
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = "60"
  statistic           = "p95"
  threshold           = "0.5" # 500ms
  alarm_description   = "Triggered when P95 response time breaches 500ms."

  tags = {
    Environment = var.environment
  }
}

variable "environment" { type = string; default = "production" }
