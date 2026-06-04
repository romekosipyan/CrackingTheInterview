# Artifact Signing Client (dlib)

This package provides the dlib component required to sign code using Artifact Signing with SignTool.

## Prerequisites

### 1. Install .NET 8.0 Runtime

Install the .NET 8.0 Runtime matching your SignTool architecture:

- **For x64 SignTool**: [Download .NET 8.0 Runtime - Windows x64 installer](https://dotnet.microsoft.com/download/dotnet/8.0)
- **For x86 SignTool**: [Download .NET 8.0 Runtime - Windows x86 installer](https://dotnet.microsoft.com/download/dotnet/8.0)

### 2. Install Windows SDK

Ensure you have a compatible version of Windows SDK with SignTool.exe installed.

## Installation

### Option 1: Direct Download

1. Download the Microsoft.ArtifactSigning.Client package
2. Extract the contents to your preferred directory on your signing node

### Option 2: NuGet Package Manager

```powershell
.\nuget.exe install Microsoft.ArtifactSigning.Client -x
```

## Configuration

Create a `metadata.json` file with your Artifact Signing account details:

```json
{
  "Endpoint": "<Artifact Signing account endpoint>",
  "CodeSigningAccountName": "<Artifact Signing account name>",
  "CertificateProfileName": "<Certificate profile name>",
  "CorrelationId": "<Optional CorrelationId value>"
}
```

> **Note**: A `metadata.sample.json` file is included in this package as a template.

### Regional Endpoints

The `Endpoint` URI must match the region where your Artifact Signing account was created:

| Region | Endpoint URI |
|--------|-------------|
| Brazil South | `https://brs.codesigning.azure.net` |
| Central US | `https://cus.codesigning.azure.net` |
| East US | `https://eus.codesigning.azure.net` |
| Japan East | `https://jpe.codesigning.azure.net` |
| Korea Central | `https://krc.codesigning.azure.net` |
| North Central US | `https://ncus.codesigning.azure.net` |
| North Europe | `https://neu.codesigning.azure.net` |
| Poland Central | `https://plc.codesigning.azure.net` |
| South Central US | `https://scus.codesigning.azure.net` |
| Switzerland North | `https://swn.codesigning.azure.net` |
| West Central US | `https://wcus.codesigning.azure.net` |
| West Europe | `https://weu.codesigning.azure.net` |
| West US | `https://wus.codesigning.azure.net` |
| West US 2 | `https://wus2.codesigning.azure.net` |
| West US 3 | `https://wus3.codesigning.azure.net` |

> **Important**: A region/endpoint mismatch commonly causes a `403 Forbidden` error during signing.

## Usage

### Basic Signing Command

```cmd
signtool.exe sign /v /debug /fd SHA256 /tr "http://timestamp.acs.microsoft.com" /td SHA256 /dlib "<Path to dlib>\bin\x64\Azure.CodeSigning.Dlib.dll" /dmdf "<Path to metadata.json>" <File to sign>
```

**Important Notes**:
- Match the dlib architecture (x86/x64) with your SignTool version
- Use `bin\x64\Azure.CodeSigning.Dlib.dll` for x64 SignTool
- Use `bin\x86\Azure.CodeSigning.Dlib.dll` for x86 SignTool
- Time stamping is **critical** for continued signature validation beyond the 3-day certificate validity period

### Example

```cmd
signtool.exe sign /v /debug /fd SHA256 /tr "http://timestamp.acs.microsoft.com" /td SHA256 /dlib "C:\ArtifactSigning\bin\x64\Azure.CodeSigning.Dlib.dll" /dmdf "C:\ArtifactSigning\metadata.json" MyApp.exe
```

## Authentication

The dlib uses `DefaultAzureCredential`, which attempts multiple authentication methods in sequence. If one fails, it tries the next until authentication succeeds.

### Supported Authentication Methods

- Environment Credential
- Managed Identity Credential
- Workload Identity Credential
- Shared Token Cache Credential
- Visual Studio Credential
- Visual Studio Code Credential
- Azure CLI Credential
- Azure PowerShell Credential
- Azure Developer CLI Credential
- Interactive Browser Credential

### Limiting Authentication Methods

To use a specific credential (e.g., Azure CLI only), exclude others in your `metadata.json`:

```json
{
  "Endpoint": "https://eus.codesigning.azure.net",
  "CodeSigningAccountName": "MySigningAccount",
  "CertificateProfileName": "MyProfile",
  "ExcludeCredentials": [
    "ManagedIdentityCredential",
    "WorkloadIdentityCredential",
    "SharedTokenCacheCredential",
    "VisualStudioCredential",
    "VisualStudioCodeCredential",
    "AzurePowerShellCredential",
    "AzureDeveloperCliCredential",
    "InteractiveBrowserCredential"
  ]
}
```

## Troubleshooting

### Common Issues

**403 Forbidden Error**
- Verify your `Endpoint` URI matches your account's region
- Check that your Azure credentials have access to the Artifact Signing account
- Ensure the `CodeSigningAccountName` and `CertificateProfileName` are correct

**DLL Not Found**
- Confirm .NET 8.0 Runtime is installed
- Verify the dlib path matches your SignTool architecture (x86 vs x64)
- Check that all DLL dependencies are present in the bin folder

**Authentication Failures**
- Ensure you're authenticated via one of the supported credential types
- Try running `az login` if using Azure CLI Credential
- Check that excluded credentials don't include your intended authentication method

## Additional Resources

- [Artifact Signing Documentation](https://aka.ms/artifactsigning/)
- [Artifact Signing GitHub Actions](https://github.com/marketplace/actions/artifact-signing)
- [Artifact Signing Azure DevOps Task](https://marketplace.visualstudio.com/items?itemName=ms-artifactsigning.artifact-signing-task)
- [Artifact Signing PowerShell Module](https://www.powershellgallery.com/packages/ArtifactSigning)
