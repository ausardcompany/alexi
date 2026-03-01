# Sync Upstream Workflow - Secrets Setup Guide

This guide provides comprehensive instructions for configuring the GitHub Secrets required by the `sync-upstream` workflow.

---

## Table of Contents

1. [Overview](#overview)
2. [Required Secrets](#required-secrets)
3. [Adding Secrets to GitHub Repository](#adding-secrets-to-github-repository)
4. [Verifying Setup](#verifying-setup)
5. [Troubleshooting](#troubleshooting)
6. [Security Notes](#security-notes)

---

## Overview

The `sync-upstream` workflow requires authentication credentials to:

1. **Access GitHub API** - To fetch upstream repository changes and create pull requests
2. **Connect to SAP AI Core** - To interact with SAP's AI services for processing

Without these secrets properly configured, the workflow will fail during authentication steps.

### Secrets Summary

| Secret Name | Purpose | Required |
|-------------|---------|----------|
| `GH_PAT` | GitHub API authentication | Yes |
| `AICORE_SERVICE_KEY` | Full SAP AI Core service key JSON | Yes |
| `AICORE_RESOURCE_GROUP` | AI Core resource group ID | Yes |

---

## Required Secrets

### GH_PAT (GitHub Personal Access Token)

A Personal Access Token (PAT) is required to authenticate with the GitHub API for operations that require elevated permissions beyond the default `GITHUB_TOKEN`.

#### Required Scopes

- `repo` - Full control of private repositories
- `workflow` - Update GitHub Action workflows

#### Step-by-Step Instructions

1. **Navigate to GitHub Settings**
   - Click on your profile picture in the top-right corner of GitHub
   - Select **Settings** from the dropdown menu

2. **Access Developer Settings**
   - Scroll down the left sidebar
   - Click on **Developer settings** (at the bottom)

3. **Create Personal Access Token**
   - Click on **Personal access tokens** in the left sidebar
   - Select **Tokens (classic)**
   - Click the **Generate new token** button
   - Select **Generate new token (classic)**

4. **Configure Token**
   - **Note**: Enter a descriptive name (e.g., `sync-upstream-workflow`)
   - **Expiration**: Choose an appropriate expiration period
     - Recommended: 90 days (set a reminder to rotate)
     - For production: Consider using fine-grained tokens with longer expiration
   - **Select scopes**:
     - [x] `repo` (Full control of private repositories)
       - This automatically includes `repo:status`, `repo_deployment`, `public_repo`, `repo:invite`, `security_events`
     - [x] `workflow` (Update GitHub Action workflows)

5. **Generate and Copy Token**
   - Click **Generate token** at the bottom
   - **IMPORTANT**: Copy the token immediately - you won't be able to see it again!
   - Store it temporarily in a secure location until you add it to repository secrets

---

### SAP AI Core Secrets

These secrets are required to authenticate with SAP AI Core services. The simplified structure only requires 2 secrets.

#### AICORE_SERVICE_KEY

The full JSON service key from SAP BTP. This contains all the authentication details needed to connect to SAP AI Core.

- **Description**: Complete service key JSON from SAP BTP
- **Format**: JSON string containing clientid, clientsecret, url, and serviceurls
- **How to obtain**:
  1. SAP BTP Cockpit → Subaccount → Services → Instances → AI Core → Service Keys
  2. Copy the entire JSON content

**Example format:**
```json
{"clientid":"...","clientsecret":"...","url":"...","serviceurls":{"AI_API_URL":"..."}}
```

#### AICORE_RESOURCE_GROUP

The resource group ID within SAP AI Core.

- **Description**: Logical grouping for AI Core resources
- **Format**: String identifier
- **Default**: `default`
- **Example**: `default` or a custom name like `my-resource-group`

---

### Getting SAP AI Core Service Key from SAP BTP

Follow these steps to obtain your SAP AI Core service key:

#### Step 1: Access SAP BTP Cockpit

1. Navigate to [SAP BTP Cockpit](https://cockpit.btp.cloud.sap/)
2. Log in with your SAP credentials

#### Step 2: Navigate to Your Subaccount

1. Select your **Global Account**
2. Click on your **Subaccount** where AI Core is provisioned

#### Step 3: Access Service Instances

1. In the left navigation menu, expand **Services**
2. Click on **Instances and Subscriptions**
3. Find your **SAP AI Core** instance in the list

#### Step 4: Create or View Service Key

**To create a new service key:**

1. Click on your AI Core instance name
2. Click on **Service Keys** tab
3. Click **Create** button
4. Enter a name for the key (e.g., `github-workflow-key`)
5. Click **Create**

**To view an existing service key:**

1. Click on your AI Core instance name
2. Click on **Service Keys** tab
3. Click on the key name to view details
4. Click **View Credentials** or the eye icon

#### Step 5: Copy the Entire Service Key JSON

The service key JSON will look similar to this:

```json
{
  "clientid": "sb-abc123-def456-ghi789!b12345|aicore!b12345",
  "clientsecret": "AbCdEf123456GhIjKlMnOpQrStUvWxYz=",
  "url": "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com",
  "identityzone": "mysubaccount",
  "identityzoneid": "12345678-1234-1234-1234-123456789012",
  "appname": "aicore!b12345",
  "serviceurls": {
    "AI_API_URL": "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com"
  },
  "oauth": {
    "url": "https://mysubaccount.authentication.eu10.hana.ondemand.com/oauth/token"
  }
}
```

**Copy the entire JSON** and use it as the value for `AICORE_SERVICE_KEY`. The application will automatically extract the required fields (clientid, clientsecret, url, etc.) from this JSON.

---

## Adding Secrets to GitHub Repository

### Step-by-Step Instructions

#### Step 1: Navigate to Repository Settings

1. Go to your GitHub repository
2. Click on **Settings** tab (requires admin access)

#### Step 2: Access Secrets Configuration

1. In the left sidebar, expand **Secrets and variables**
2. Click on **Actions**

#### Step 3: Add Each Secret

1. Click the **New repository secret** button
2. Enter the **Name** (exactly as shown in the table above)
3. Paste the **Secret** value
4. Click **Add secret**

#### Step 4: Repeat for All Secrets

Add all three required secrets:

```
GH_PAT                      → Your GitHub Personal Access Token
AICORE_SERVICE_KEY          → The entire JSON service key from SAP BTP
AICORE_RESOURCE_GROUP       → default (or your custom resource group name)
```

### Visual Reference

Your repository secrets page should show:

```
Repository secrets (3)
┌─────────────────────────────┬─────────────┐
│ Name                        │ Updated     │
├─────────────────────────────┼─────────────┤
│ GH_PAT                      │ just now    │
│ AICORE_SERVICE_KEY          │ just now    │
│ AICORE_RESOURCE_GROUP       │ just now    │
└─────────────────────────────┴─────────────┘
```

---

## Verifying Setup

### Trigger a Manual Workflow Run

1. Go to your repository on GitHub
2. Click on the **Actions** tab
3. Select the **Sync Upstream** workflow from the left sidebar
4. Click **Run workflow** button
5. Select the branch (usually `main`)
6. Click the green **Run workflow** button

### Monitor Workflow Execution

1. Click on the running workflow to see details
2. Expand each job step to view logs
3. Look for successful authentication messages

### Expected Log Output (Success)

```
✓ Authenticated with GitHub API
✓ Connected to SAP AI Core
✓ Resource group 'default' accessible
✓ Workflow completed successfully
```

### What to Look For

- **GitHub Authentication**: Look for successful API calls in early steps
- **SAP AI Core Connection**: Check for OAuth token retrieval success
- **No "secret not found" errors**: All secrets should resolve

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Token Expired

**Symptoms:**
- Error message: `Bad credentials` or `401 Unauthorized`
- Workflow fails at GitHub API calls

**Solution:**
1. Generate a new Personal Access Token
2. Update the `GH_PAT` secret in repository settings
3. Re-run the workflow

#### 2. Wrong Scopes on GH_PAT

**Symptoms:**
- Error message: `Resource not accessible by integration`
- Error message: `Must have admin rights to Repository`

**Solution:**
1. Verify token has `repo` and `workflow` scopes
2. If missing, generate a new token with correct scopes
3. Update the `GH_PAT` secret

#### 3. SAP AI Core Authentication Failures

**Symptoms:**
- Error message: `401 Unauthorized` or `Invalid client credentials`
- Error message: `Unable to obtain access token`

**Possible Causes and Solutions:**

| Cause | Solution |
|-------|----------|
| Invalid service key JSON | Verify `AICORE_SERVICE_KEY` contains valid JSON |
| Incomplete service key | Ensure the entire JSON was copied from SAP BTP |
| Service key expired | Create a new service key in SAP BTP |

#### 4. Resource Group Not Found

**Symptoms:**
- Error message: `Resource group not found`
- Error message: `403 Forbidden` on resource group access

**Solution:**
1. Verify the resource group exists in SAP AI Core
2. Check spelling of `AICORE_RESOURCE_GROUP`
3. Use `default` if unsure

#### 5. Quota Limits Exceeded

**Symptoms:**
- Error message: `Rate limit exceeded`
- Error message: `Quota exhausted`

**Solution:**
1. Wait for the rate limit to reset
2. Check SAP AI Core quota in BTP Cockpit
3. Request quota increase if needed

#### 6. Secret Not Found

**Symptoms:**
- Error message: `Context access might be invalid: AICORE_SERVICE_KEY`
- Workflow fails before any API calls

**Solution:**
1. Verify secret name matches exactly (case-sensitive)
2. Check secret is added to the correct repository
3. Ensure no leading/trailing whitespace in secret values

---

## Security Notes

### Best Practices

#### Never Commit Secrets to Repository

- **DO NOT** add secrets to any configuration files
- **DO NOT** commit `.env` files containing real credentials
- **DO NOT** log secret values in workflow outputs
- Add `.env*` to your `.gitignore` file

#### Rotate Tokens Periodically

| Secret Type | Recommended Rotation |
|-------------|---------------------|
| GitHub PAT | Every 90 days |
| SAP AI Core credentials | Every 6-12 months |

Set calendar reminders to rotate tokens before expiration.

#### Use Minimum Required Scopes

Only grant the permissions absolutely necessary:

- `GH_PAT`: Only `repo` and `workflow` scopes
- SAP AI Core: Use dedicated service key for this workflow only

#### Audit Secret Access

1. Review repository access regularly
2. Remove secrets when no longer needed
3. Monitor workflow runs for unusual activity

#### Environment-Specific Secrets

For organizations with multiple environments:

- Use GitHub Environments feature
- Set different secrets per environment (dev, staging, prod)
- Require approvals for production environment

### Emergency Procedures

If you suspect a secret has been compromised:

1. **GitHub PAT**: Immediately revoke at GitHub Settings → Developer settings → Personal access tokens
2. **SAP AI Core**: Delete the service key in SAP BTP Cockpit and create a new one
3. **Update** all affected repository secrets
4. **Review** recent workflow runs for suspicious activity
5. **Audit** any actions taken with the compromised credentials

---

## Quick Reference

### Checklist for Initial Setup

- [ ] GitHub PAT created with `repo` and `workflow` scopes
- [ ] SAP AI Core service key created in BTP Cockpit
- [ ] All 3 secrets added to repository
- [ ] Manual workflow run successful
- [ ] Token expiration dates documented

### Secrets Quick Copy Template

```
Secret Name                  Value Source
─────────────────────────────────────────────────
GH_PAT                      GitHub → Settings → Developer settings → PAT
AICORE_SERVICE_KEY          Service Key → entire JSON content
AICORE_RESOURCE_GROUP       Usually "default"
```

---

## Support

If you continue to experience issues after following this guide:

1. Review workflow logs for specific error messages
2. Check SAP AI Core service status in BTP Cockpit
3. Verify GitHub API status at [githubstatus.com](https://www.githubstatus.com/)
4. Consult SAP AI Core documentation for API-specific errors
