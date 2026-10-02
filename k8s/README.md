# CloudPulse X — Kubernetes Deployment Guide

This directory contains production-style Kubernetes manifests to deploy CloudPulse X on an EKS, GKE, AKS, or local Minikube/Kind cluster.

## Manifest Overview

| File | Resource Type | Description |
| :--- | :--- | :--- |
| `namespace.yaml` | `Namespace` | Dedicated `cloudpulse-x` isolation boundary |
| `configmap.yaml` | `ConfigMap` & `Secret` | Environment variables, provider modes, and database connection strings |
| `backend-deployment.yaml` | `Deployment` & `Service` | 2-replica Python FastAPI backend with HTTP health probes |
| `frontend-deployment.yaml` | `Deployment`, `Service` & `Ingress` | Nginx SPA frontend with unified path-based ingress routing |

## Applying Manifests to Cluster

```bash
# 1. Create Namespace
kubectl apply -f k8s/namespace.yaml

# 2. Apply ConfigMap and Secrets
kubectl apply -f k8s/configmap.yaml

# 3. Deploy Backend & Frontend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# 4. Verify Pod Status
kubectl get pods -n cloudpulse-x
```
