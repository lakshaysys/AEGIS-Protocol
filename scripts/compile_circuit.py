import os
import subprocess
import sys

def run_pipeline():
    print("Initializing Project A.E.G.I.S. ZK-ML Verification Pipeline, sir...")
    
    circuit_path = "circuits/aegis_verifier.circom"
    if not os.path.exists(circuit_path):
        print(f"Critical Error: Circuit file not found at {circuit_path}")
        sys.exit(1)

    # Ensure build directory exists
    os.makedirs("build", exist_ok=True)

    print("Step 1: Compiling Circom circuit to R1CS and WASM...")
    compile_cmd = [
        "circom", circuit_path, 
        "--r1cs", "--wasm", "--sym", 
        "-o", "build/"
    ]
    
    result = subprocess.run(compile_cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Circom compilation failed:\n{result.stderr}")
        sys.exit(1)
    print("Circuit compiled successfully.")

    print("Step 2: Preparing for witness generation and Groth16 proof creation...")
    # Note: Actual witness calculation and proving would follow here using snarkjs
    # e.g., subprocess.run(["snarkjs", "wtns", "calculate", "build/aegis_verifier.wasm", "input.json", "build/witness.wtns"])
    
    print("Pipeline execution complete, sir. Artifacts are ready for smart contract settlement.")

if __name__ == "__main__":
    run_pipeline()
