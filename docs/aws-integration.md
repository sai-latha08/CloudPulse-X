# AWS Integration & Cloud Provider Abstraction

## 1. Provider Pattern

CloudPulse X separates infrastructure monitoring logic from vendor SDKs via the `CloudProvider` base class:

```python
class CloudProvider(ABC):
    @abstractmethod
    def get_resources(self) -> List[Dict[str, Any]]: ...
    
    @abstractmethod
    def get_resource_metrics(self, resource_id: str, time_range: str) -> Dict[str, Any]: ...
    
    @abstractmethod
    def get_security_findings(self) -> List[Dict[str, Any]]: ...
    
    @abstractmethod
    def get_cost_data(self) -> Dict[str, Any]: ...
    
    @abstractmethod
    def execute_remediation(self, action_type: str, target_resource_id: str, simulation_mode: bool) -> Dict[str, Any]: ...
```

## 2. Supported AWS Services (Boto3)

- **EC2 (`boto3.client('ec2')`):** `describe_instances`, `reboot_instances`, `describe_security_groups`.
- **CloudWatch (`boto3.client('cloudwatch')`):** `get_metric_data` for CPUUtilization, RequestCount, and TargetResponseTime.
- **RDS (`boto3.client('rds')`):** `describe_db_instances`, storage encryption audits.
- **S3 (`boto3.client('s3')`):** `list_buckets`, `get_public_access_block`, `get_bucket_encryption`.
- **IAM (`boto3.client('iam')`):** `list_roles`, policy permission least-privilege checks.

## 3. Switching Modes

Set the `CLOUD_PROVIDER` environment variable:
- `CLOUD_PROVIDER=demo` (Default: Offline deterministic scenario simulator)
- `CLOUD_PROVIDER=aws` (Live AWS account with Boto3 SDK)
