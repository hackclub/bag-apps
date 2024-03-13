this_dir = File.expand_path(File.dirname(__FILE__))
lib_dir = File.join(this_dir, "lib")
$LOAD_PATH.unshift(lib_dir) unless $LOAD_PATH.include?(lib_dir)

require "grpc"
require "json"
require "bag_services_pb"

PERMISSIONS = {
  ADMIN: 4,
  WRITE: 3,
  WRITE_SPECIFIC: 2,
  READ_PRIVATE: 1,
  READ: 0,
}

class Client
  attr_accessor :client
  attr_accessor :request

  def initialize(options)
    if !options.has_key?(:app_id) or !options.has_key?(:key)
      raise "Error: app_id and/or key not provided"
    end

    @request = { appId: options[:app_id], key: options[:key] }
    stub = Bag::BagService::Stub.new(options[:host] || "bag-client.hackclub.com", :this_channel_is_insecure)
    begin
      verify = stub.verify_key(Bag::VerifyKeyRequest.new(@request))
      if !verify.valid
        raise "Error: app_id and/or key invalid"
      end
      @client = stub
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def format(obj)
    obj = obj.to_h 
    if obj[:response].length != 0
      raise obj[:response]
    end
    obj.each do |entry, value|
      if entry == "metadata"
        obj[entry] = JSON.parse(value)
        if obj[entry].class == String
          obj[entry] = JSON.parse(obj[entry])
        end
      elsif value == Object
        obj[entry] = format(value)
      end
    end
  end

  def create_app(request)
    begin
      resp = @client.create_app(Bag::CreateAppRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def create_instances(request)
    begin
      resp = @client.create_instances(Bag::CreateInstancesRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def create_instance(request)
    begin
      resp = @client.create_instance(Bag::CreateInstanceRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def create_item(request)
    begin
      resp = @client.create_item(Bag::CreateItemRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def create_trade(request)
    begin
      resp = @client.create_trade(Bag::CreateTradeRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def create_recipe(request) 
    begin
      resp = @client.create_recipe(Bag::CreateRecipeRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def create_action(request)
    begin
      resp = @client.create_action(Bag::CreateActionRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def read_app(request)
    begin
      resp = @client.read_app(Bag::ReadAppRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def read_identity(request)
    begin
      resp = @client.read_identity(Bag::ReadIdentityRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def read_inventory(request)
    begin
      resp = @client.read_inventory(Bag::ReadInventoryRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def read_item(request)
    begin
      resp = @client.read_items(Bag::ReadItemRequest(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def read_items(request)
    begin
      resp = @client.read_items(Bag::ReadItemsRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def read_instance(request)
    begin
      resp = @client.read_instance(Bag::ReadInstanceRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def read_trade(request)
    begin
      resp = @client.read_trade(Bag::ReadTradeRequest(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def read_recipes(request)
    begin 
      resp = @client.read_recipes(Bag::ReadRecipesRequest(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def read_recipe(request)
    begin
      resp = @client.read_recipe(Bag::ReadRecipeRequest(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def read_action(request)
    begin
      resp = @client.read_action(Bag::ReadActionRequest(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def update_identity_metadata(request)
    begin
      resp = @client.update_identity_metadata(Bag::UpdateIdentityMetadataRequest(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def update_instance(request)
    begin
      resp = @client.update_instance(Bag::UpdateInstanceRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def update_item(request)
    begin
      resp = @client.update_item(Bag::UpdateItemRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def update_app(request)
    begin
      resp = @client.update_app(Bag::UpdateAppRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def update_trade(request)
    begin
      resp = @client.update_app(Bag::UpdateTradeRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def update_recipe(request)
    begin
      resp = @client.update_recipe(Bag::UpdateRecipeRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def update_action(request)
    begin
      resp = @client.update_action(Bag::UpdateActionRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def delete_app(request)
    begin
      resp = @client.delete_app(Bag::DeleteAppRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def delete_instance(request)
    begin
      resp = @client.delete_instance(Bag::DeleteInstanceRequest.new(@request.merge(request)))
      return format(resp)
    rescue GRPC::BadStatus => e
      abort "Error: #{e.message}"
    end
  end

  def close_trade(request)
    resp = @client.close_trade(Bag::CloseTradeRequest.new(@request.merge(request)))
    return format(resp)
  rescue GRPC::BadStatus => e
    abort "Error: #{e.message}"
  end
end

client = Client.new({ app_id: 1, key: "e0022b70-a6a4-4c85-91a7-eef1a1055081", host: "localhost:3000" })
hat = client.read_items({ query: { name: "Hat" }.to_json })[:items][0]
p hat[:description]