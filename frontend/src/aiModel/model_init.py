import onnx
from onnx import helper
from onnx import TensorProto
import os

def create_initial_model():
    model_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')
    model_path = os.path.join(model_dir, 'forgery_detector.onnx')

    # Create models directory if it doesn't exist
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)

    # Create a simple model that outputs a forgery score
    X = helper.make_tensor_value_info('input', TensorProto.FLOAT, [1, 1024])
    Y = helper.make_tensor_value_info('output', TensorProto.FLOAT, [1, 1])

    # Create model node
    node = helper.make_node(
        'Gemm',
        ['input'],
        ['output'],
        'forgery_detector',
        alpha=1.0,
        beta=0.0,
        transA=0,
        transB=0
    )

    # Create graph
    graph = helper.make_graph(
        [node],
        'forgery_detector',
        [X],
        [Y]
    )

    # Create model
    model = helper.make_model(graph)
    
    # Save model
    onnx.save(model, model_path)
    print(f"Initial model created at: {model_path}")

if __name__ == "__main__":
    create_initial_model()
