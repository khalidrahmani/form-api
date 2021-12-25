local name = "abdullah ibn tofail"
local function split(s, delimiter)
    result = {};
    for match in (s..delimiter):gmatch("(.-)"..delimiter) do
        table.insert(result, match);
    end
    return result;
end
local splitedname = string.gsub(name, "%s+", " ")
print ("splitedname")
local example = "an example string"
for i in string.gmatch(example, "%S+") do
   print(i)
end
--if redis.call("EXISTS", KEYS[1]) == 1 then
--  local  payload = redis.call("GET", KEYS[1])
--  return cjson.decode(payload)[ARGV[1]]  
--else
--  return nil
--end

--return cmsgpack.unpack(payload)[ARGV[1]]