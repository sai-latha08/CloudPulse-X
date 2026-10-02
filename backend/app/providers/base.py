from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class CloudProvider(ABC):
    @abstractmethod
    def get_resources(self) -> List[Dict[str, Any]]:
        """Fetch all cloud resources."""
        pass

    @abstractmethod
    def get_resource_metrics(self, resource_id: str, time_range: str = "24h") -> Dict[str, Any]:
        """Fetch time-series metrics for a given resource."""
        pass

    @abstractmethod
    def get_security_findings(self) -> List[Dict[str, Any]]:
        """Fetch security vulnerability and configuration findings."""
        pass

    @abstractmethod
    def get_cost_data(self) -> Dict[str, Any]:
        """Fetch cloud cost breakdown and optimization suggestions."""
        pass

    @abstractmethod
    def execute_remediation(self, action_type: str, target_resource_id: str, simulation_mode: bool = True) -> Dict[str, Any]:
        """Execute or simulate a remediation action on a cloud resource."""
        pass
